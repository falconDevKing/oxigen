import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import { success, error } from "utils/responseFormat";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;
const authToken = process.env.STAFF_AUTH_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      let offsetValue = 0;

      let salesData: any[] = [];

      const fetchsalesData = async () => {
        const fetchedSalesDataSet = await Axios.get("sale/sales", { params: { limit: 200, offset: offsetValue, ...req.query } });
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
    } catch (err) {
      console.log("Error getting sales", err);
      const errorResponse = error(500, "Error getting sales", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
