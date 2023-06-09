import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const authToken = req.headers.authorization;

    try {
      const offsetMax = 200;
      let offsetValue = 0;

      let clientData: any[] = [];

      const fetchclientData = async () => {
        // const fetchedClientsDataSet = await Axios.get("client/clients", { params: { limit: 200, offset: offsetValue } });
        const fetchedClientsDataSet = await Axios.get("client/clients", { params: { limit: 200, offset: offsetValue }, headers: { Authorization: authToken } });
        const clients = fetchedClientsDataSet.data.Clients;
        const requestedOffset = fetchedClientsDataSet.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedClientsDataSet.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedClientsDataSet.data.PaginationResponse.TotalResults;

        clientData = [...clientData, ...clients];

        // if (nextOffset < totalResultSize) {
        if (nextOffset < 200) {
          offsetValue = nextOffset;
          await fetchclientData();
        }
      };

      await fetchclientData();

      const successResponse = success(200, "FetchClsients", clientData);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting clients", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clients", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
