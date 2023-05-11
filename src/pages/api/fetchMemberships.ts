import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const authToken = req.headers.authorization;
      const fetchedMemberships = await Axios.get("site/memberships", { headers: { Authorization: authToken } });
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
    } catch (err: any) {
      console.log("Error getting clients", err?.message, err);
      const errorResponse = error(500, err?.message ?? "Error getting clients", err);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}
