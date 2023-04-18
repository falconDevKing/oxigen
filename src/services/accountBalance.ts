import { simpleObject } from "./memberships";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridValueGetterParams } from "@mui/x-data-grid";
import { salesPeriod } from "./sales";
import moment from "moment";

export const createAccountPeriodBalance = (clientsData: any[], salesMonth: string) => {
  const arrearsBalance = clientsData.reduce((accumulator, currentValue) => {
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

export const createAccountBalance = (clientsData: any[], salePeriod: salesPeriod[]) => {
  const clientsTableData = clientsData.map((clientData, index) => {
    const clientDataResult = createAccountPeriodBalance(clientData, salePeriod[index].a);
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
      width: 250,
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
