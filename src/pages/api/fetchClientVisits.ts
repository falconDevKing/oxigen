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

      let clientVisitsData: any[] = [];

      const fetchclientVisitsData = async () => {
        const fetchedClientVisitsDataSet = await Axios.get("client/clientvisits", {
          params: { limit: 200, offset: offsetValue, ...req.query },
          headers: { Authorization: authToken },
        });
        const clientVisits = fetchedClientVisitsDataSet.data.Visits;
        const requestedOffset = fetchedClientVisitsDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedClientVisitsDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedClientVisitsDataSet.data.PaginationResponse.TotalResults;

        clientVisitsData = [...clientVisits, ...clientVisits];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchclientVisitsData();
        }
      };

      await fetchclientVisitsData();

      const successResponse = success(200, "FetchClientsVisits", clientVisitsData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting clients Visits", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clients Visits", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
