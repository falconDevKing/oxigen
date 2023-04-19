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
      const { clientsIds } = req.query;
      const clientIdsArray = (clientsIds as string).split(",");

      const offsetMax = 200;
      let offsetValue = 0;

      let clientsMembershipsObjectsArray: any[] = [];

      const fetchMembershipsData = async () => {
        const fetchedClientsMemberships = await Axios.get("client/activeclientsmemberships", {
          params: { limit: 200, offset: offsetValue, clientIds: clientIdsArray },
          headers: { Authorization: authToken },
        });
        const clientMemberships = fetchedClientsMemberships.data.ClientMemberships;
        const requestedOffset = fetchedClientsMemberships.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedClientsMemberships.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedClientsMemberships.data.PaginationResponse.TotalResults;

        clientsMembershipsObjectsArray = [...clientsMembershipsObjectsArray, ...clientMemberships]; // [m,m] // [{m},{m}]

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchMembershipsData();
        }
      };

      await fetchMembershipsData();

      const getUniqueMembershipCodes = (membershipsArray: any[]) => {
        const membershipsIds: number[] = membershipsArray.map((membership) => membership.MembershipId);

        const uniqueMembershipIds = Array.from(new Set(membershipsIds));
        return uniqueMembershipIds;
      };

      const clientsMembershipsIdsArray = clientsMembershipsObjectsArray
        .map((clientsMembershipsObject) => getUniqueMembershipCodes(clientsMembershipsObject.Memberships))
        .flat();

      // const successResponse = success(200, "FetchClientsMemberships", { memberships, uniqueMembershipIds });
      const successResponse = success(200, "FetchClientsMemberships", clientsMembershipsIdsArray);
      res.status(successResponse.status).json(successResponse);
    } catch (err: any) {
      console.log("Error getting clientsMemberships", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clientsMemberships", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
