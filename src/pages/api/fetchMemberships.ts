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
      const fetchedMemberships = await Axios.get("site/memberships");
      const memberships = fetchedMemberships.data.Memberships;

      const modifiedMemberships = memberships.map((membership: any) => {
        const updatedMembership = {
          MembershipId: membership.MembershipId,
          Priority: membership.Priority,
          MembershipName: membership.MembershipName,
          IsActive: membership.IsActive,
        };

        return updatedMembership;
      });

      const successResponse = success(200, "Fetched Memeberships", modifiedMemberships);
      res.status(successResponse.status).json(successResponse);
    } catch (err) {
      console.log("Error getting clients", err);
      const errorResponse = error(500, "Error getting clients", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
