import { NextApiRequest, NextApiResponse } from "next";
import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const authToken = req.headers.authorization;

    const data = {
      // id: "uuid",
      reportWeek: "2023-04-10T00:00:00Z",
      newWeekLeadsCount: 85,
      newWeekLeadsTrials: 32,
      percentWeekLeadToTrial: "37.65",
      monthTDLeads: 144,
      monthTDLeadsTrials: 45,
      percentMonthLeadToTrial: "31.25",
      monthTDBilledleads: 3,
      percentMonthBilledLeads: "2.08",
      monthTDPacksUpfrontleads: 3,
      percentMonthPacksUpfrontLeads: "2.08",
      monthTDLeadPurchasedNothing: 83,
      monthTDTrialsPurchasaed: 61,
      monthTDTrialsToVisit: 22,
      percentMonthTDTrialsToVisit: "36.07",
      monthTDTrialsWithVisitToBilled: 2,
      percentMonthTDTrialsWithVisitToBilled: "3.28",
      monthTDPacksUpfront: 8,
      totalBilled: 171,
      activeBilled: 148,
      limitedBilled: 64,
      unlimitedBilled: 82,
      challengeUpfront: 0,
      complimentary: 0,
      paidInFull: 3,
      classPasses: 6,
      Suspended: 23,
      declined: 2,
      billedMemberGrowth: "prevNeeded",
      weeklyCancellations: "prevNeeded",
      attritionRate: "prevNeeded",
      totalWeeklyBilledIncome: 3911.01,
      totalWeeklyIncome: 6061.01,
      weeklyIncomeGrowth: "prevNeeded",
      accountBalanceOwing: -4019.88,
      avergaeBillingPerMember: "40.95",
      weekAttendance: 303,
      noShowCancel: 13,
      unpaidVisits: 0,
      active: 446,
      expired: 1652,
      terminated: 256,
      nonMember: 3441,
      inActive: 0,
      updatedAt: "2023-05-04T01:00:46Z",
      expireAt: 1717459246,
    };

    res.status(200).json(data);

    // try {
    //   const offsetMax = 200;
    //   let offsetValue = 0;

    //   let clientData: any[] = [];

    //   const fetchclientData = async () => {
    //     // const fetchedClientsDataSet = await Axios.get("client/clients", { params: { limit: 200, offset: offsetValue } });
    //     const fetchedClientsDataSet = await Axios.get("client/clients", { params: { limit: 200, offset: offsetValue }, headers: { Authorization: authToken } });
    //     const clients = fetchedClientsDataSet.data.Clients;
    //     const requestedOffset = fetchedClientsDataSet.data.PaginationResponse.RequestedOffset;
    //     const pageSize = fetchedClientsDataSet.data.PaginationResponse.PageSize;
    //     const nextOffset = requestedOffset + pageSize;
    //     const totalResultSize = fetchedClientsDataSet.data.PaginationResponse.TotalResults;

    //     clientData = [...clientData, ...clients];

    //     // if (nextOffset < totalResultSize) {
    //     if (nextOffset < 200) {
    //       offsetValue = nextOffset;
    //       await fetchclientData();
    //     }
    //   };

    //   await fetchclientData();

    //   const successResponse = success(200, "FetchClsients", clientData);
    //   res.status(successResponse.status).json(successResponse);
    // } catch (err: any) {
    //   console.log("Error getting clients", err?.message, err);
    //   const errorResponse = error(500, err?.message ?? "Error getting clients", err);
    //   res.status(errorResponse.status).json(errorResponse);
    // }
  }
}
