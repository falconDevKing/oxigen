import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      const offsetMax = 200;
      let offsetValue = 0;

      let clientData;

      const fetchCompleteClientInfoData = async () => {
        const fetchedCompleteClientInfoDataSet = await Axios.get("client/clientcompleteinfo", {
          params: { limit: 200, offset: offsetValue, ...req.query },
          headers: { Authorization: authToken },
        });
        clientData = fetchedCompleteClientInfoDataSet.data;
        // const requestedOffset = fetchedCompleteClientInfoDataSet.data.PaginationResponse.RequestedOffset;
        // const pageSize = fetchedCompleteClientInfoDataSet.data.PaginationResponse.PageSize;
        // const nextOffset = requestedOffset + pageSize;
        // const totalResultSize = fetchedCompleteClientInfoDataSet.data.PaginationResponse.TotalResults;

        // clientData = [...clientData, ...clients];

        // if (nextOffset < totalResultSize) {
        //   offsetValue = nextOffset;
        //   await fetchCompleteClientInfoData();
        // }
      };

      await fetchCompleteClientInfoData();

      const successResponse = success(200, "FetchClientsContracts", clientData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting clients contracts", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clients contracts", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
