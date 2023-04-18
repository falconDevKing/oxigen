import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;
const authToken = process.env.STAFF_AUTH_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      const offsetMax = 200;
      let offsetValue = 0;

      let clientData: any[] = [];

      const fetchclientContractsData = async () => {
        const fetchedClientContractsDataSet = await Axios.get("client/clientcontracts", {
          params: { limit: 200, offset: offsetValue, ...req.query },
          headers: { Authorization: authToken },
        });
        const clients = fetchedClientContractsDataSet.data.Contracts;
        const requestedOffset = fetchedClientContractsDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedClientContractsDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedClientContractsDataSet.data.PaginationResponse.TotalResults;

        clientData = [...clientData, ...clients];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchclientContractsData();
        }
      };

      await fetchclientContractsData();

      const successResponse = success(200, "FetchClientsContracts", clientData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting clients contracts", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clients contracts", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
