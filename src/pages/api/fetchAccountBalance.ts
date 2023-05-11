import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      const { clientsIds, balanceDate } = req.query;
      const clientIdsArray = (clientsIds as string).split(",");

      let offsetValue = 0;

      let accountBalanceData: any[] = [];

      const fetchAccountBalanceData = async () => {
        const fetchedAccountBalanceDataSet = await Axios.get("client/clientaccountbalances", {
          params: { limit: 200, offset: offsetValue, balanceDate, clientIds: clientIdsArray },
          headers: { Authorization: authToken },
        });
        const accountBalance = fetchedAccountBalanceDataSet.data.Clients;
        const requestedOffset = fetchedAccountBalanceDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedAccountBalanceDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedAccountBalanceDataSet.data.PaginationResponse.TotalResults;

        accountBalanceData = [...accountBalanceData, ...accountBalance];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchAccountBalanceData();
        }
      };

      await fetchAccountBalanceData();

      // const successResponse = success(200, "FetchAccountBalance", []);
      const successResponse = success(200, "FetchAccountBalance", accountBalanceData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting AccountBalance", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting AccountBalance", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
