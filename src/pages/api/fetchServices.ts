import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      let offsetValue = 0;

      let servicesData: any[] = [];

      const fetchServicesData = async () => {
        const fetchedServicesDataSet = await Axios.get("sale/services", {
          params: { limit: 200, offset: offsetValue, includeDiscontinued: false },
          headers: { Authorization: authToken },
        });
        const services = fetchedServicesDataSet.data.Services;
        const requestedOffset = fetchedServicesDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedServicesDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedServicesDataSet.data.PaginationResponse.TotalResults;

        servicesData = [...servicesData, ...services];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchServicesData();
        }
      };

      await fetchServicesData();

      const successResponse = success(200, "FetchServices", servicesData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting services", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting services", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
