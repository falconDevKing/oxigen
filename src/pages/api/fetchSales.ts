import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      let offsetValue = 0;

      let salesData: any[] = [];

      const fetchsalesData = async () => {
        const fetchedSalesDataSet = await Axios.get("sale/sales", {
          params: { limit: 200, offset: offsetValue, ...req.query },
          headers: { Authorization: authToken },
        });
        const sales = fetchedSalesDataSet.data.Sales;
        const requestedOffset = fetchedSalesDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedSalesDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedSalesDataSet.data.PaginationResponse.TotalResults;

        salesData = [...salesData, ...sales];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchsalesData();
        }
      };

      await fetchsalesData();

      const successResponse = success(200, "Fetchsales", salesData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting sales", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting sales", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
