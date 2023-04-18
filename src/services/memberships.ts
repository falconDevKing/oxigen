import Axios from "utils/axiosInstance";
import axios from "axios";
import { success, error } from "utils/responseFormat";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridValueGetterParams } from "@mui/x-data-grid";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const siteId = process.env.NEXT_PUBLIC_SITE_ID;
const authToken = process.env.NEXT_PUBLIC_STAFF_AUTH_TOKEN;

export type numberObject = { [x: string]: number };
export type stringObject = { [x: string]: string };
export type simpleObject = { [x: string]: string | number };
export type complexObject = { [x: string]: any };

export const getActiveClientsUniqueMembershipIds = async (clientId: string) => {
  const getActiveClientMembershipsIds = await axios.post("/api/fetchActiveClientMemberships", { clientId: clientId });
  const activeClientMembershipsIds: number[] = getActiveClientMembershipsIds.data.data;

  return activeClientMembershipsIds;
};

const getActiveMembership = (activeClientsMemberships: number[], membershipsData: any[]) => {
  const uniqueMemberships = Array.from(new Set(activeClientsMemberships));
  const membershipsQuantity = uniqueMemberships.map((uniqueMembership) => {
    const selectedMembership = activeClientsMemberships.filter((activeClientsMembership) => activeClientsMembership === uniqueMembership);
    const membership = membershipsData.find((membership) => membership.MembershipId === uniqueMembership)?.MembershipName;
    return [membership, selectedMembership.length];
  });

  const activeMemberShipObject: simpleObject = Object.fromEntries(membershipsQuantity);
  return activeMemberShipObject;
};

const getGenericFigures = (clients: any[]) => {
  let declined = 0;
  let expired = 0;
  let suspended = 0;
  let terminated = 0;

  clients.forEach((client) => {
    if (client.Status === "Terminated") {
      terminated = +1;
    }
    if (client.Status === "Expired") {
      expired = +1;
    }
    if (client.Status === "Suspended") {
      suspended = +1;
    }
    if (client.Status === "Declined") {
      declined = +1;
    }
  });

  return { declined, expired, suspended, terminated };
};

export const createMembershipTableData = (clientsData: any[], membershipsData: any[], activeClientsMemberships: number[]) => {
  const activeMemberShipObject = getActiveMembership(activeClientsMemberships, membershipsData);

  const membershipsToAdd = Object.keys(activeMemberShipObject);

  const dynamicGridColumns: GridColDef[] = membershipsToAdd.map((membership) => ({
    field: membership,
    headerName: membership,
    width: 150,
    editable: false,
  }));

  const membershipColumns = [
    {
      field: "month",
      headerName: "Monthly",
      width: 300,
      editable: false,
    },
    ...dynamicGridColumns,
    {
      field: "declined",
      headerName: "Declined",
      width: 150,
      editable: false,
    },
    {
      field: "suspended",
      headerName: "Suspended",
      width: 150,
      editable: false,
    },
    {
      field: "terminated",
      headerName: "Terminations",
      width: 150,
      editable: false,
    },
  ];

  const initialRowObject: simpleObject = {
    month: "March 2023",
  };

  const nonActiveDataObject: simpleObject = getGenericFigures(clientsData);

  const updatedRowObject = Object.assign(initialRowObject, activeMemberShipObject, nonActiveDataObject);

  return {
    columnsData: membershipColumns,
    rowsData: updatedRowObject,
  };
};
