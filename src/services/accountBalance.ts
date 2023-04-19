import { simpleObject } from "./memberships";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { period } from "./sales";
import moment from "moment";

export const createAccountPeriodBalance = (clientsData: any[], salesMonth: string) => {
  const arrearsBalance = (clientsData ?? []).reduce((accumulator, currentValue) => {
    if (currentValue.AccountBalance >= 0) {
      return accumulator + 0;
    } else {
      return accumulator + currentValue.AccountBalance;
    }
  }, 0);

  const initialRowObject: simpleObject = {
    month: moment(salesMonth).format("MMM YYYY"),
    accountBalance: arrearsBalance,
  };

  return initialRowObject;
};

export const createAccountBalance = (clientsData: any[], intervals: period[]) => {
  const clientsTableData = clientsData.map((clientData, index) => {
    const clientDataResult = createAccountPeriodBalance(clientData, intervals[index].a);
    return clientDataResult;
  });

  const accountBalanceColumns: GridColDef[] = [
    {
      field: "month",
      headerName: "Monthly",
      width: 200,
      editable: false,
    },
    {
      field: "accountBalance",
      headerName: "Account Balance (Arrears)",
      width: 200,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.accountBalance * -1).toFixed(2)}`,
      align: "right",
    },
  ];

  return {
    columnsData: accountBalanceColumns,
    rowsData: clientsTableData,
  };
};
