import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;
const authToken = process.env.STAFF_AUTH_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { clientId } = req.body;
    try {
      const offsetMax = 200;
      let offsetValue = 0;

      let memberships: any[] = [];

      const fetchMembershipsData = async () => {
        const fetchedClientsMemberships = await Axios.get("client/activeclientmemberships", {
          params: { limit: 200, offset: offsetValue, clientId: clientId },
        });
        const clientMemberships = fetchedClientsMemberships.data.ClientMemberships;
        const requestedOffset = fetchedClientsMemberships.data.PaginationResponse.RequestedOffset;
        const pageSize = fetchedClientsMemberships.data.PaginationResponse.PageSize;
        const nextOffset = requestedOffset + pageSize;
        const totalResultSize = fetchedClientsMemberships.data.PaginationResponse.TotalResults;

        memberships = [...memberships, ...clientMemberships];

        if (nextOffset < totalResultSize) {
          offsetValue = nextOffset;
          await fetchMembershipsData();
        }
      };

      await fetchMembershipsData();

      const getUniqueMembershipCodes = () => {
        const membershipsIds: number[] = memberships.map((membership) => membership.MembershipId);

        const uniqueMembershipIds = Array.from(new Set(membershipsIds));
        return uniqueMembershipIds;
      };

      const uniqueMembershipIds = getUniqueMembershipCodes();

      // const successResponse = success(200, "FetchClientsMemberships", { memberships, uniqueMembershipIds });
      const successResponse = success(200, "FetchClientsMemberships", uniqueMembershipIds);
      res.status(successResponse.status).json(successResponse);
    } catch (err) {
      console.log("Error getting clientsMemberships", err);
      const errorResponse = error(500, "Error getting clientsMemberships", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
