import moment from "moment";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export const createAutoPay = (clientsContracts: any[]) => {
  const contracts = clientsContracts.flat();

  const activeAutopaysEvents: any[] = [];
  const suspendedAutopaysEvents: any[] = [];

  const categoriseAutopays = contracts.forEach((contract) => {
    if (contract.AutopayStatus === "Active") {
      activeAutopaysEvents.push(...contract?.UpcomingAutopayEvents);
    }
    if (contract.AutopayStatus === "Suspended") {
      suspendedAutopaysEvents.push(...contract?.UpcomingAutopayEvents);
    }
  });

  const formatString = "YYYY-MM-DDThh:mm:ss[Z]";
  const init = moment().startOf("month").format(formatString);
  const one = moment().startOf("month").add(1, "months").format(formatString);
  const two = moment().startOf("month").add(2, "months").format(formatString);
  const three = moment().startOf("month").add(3, "months").format(formatString);
  const four = moment().startOf("month").add(4, "months").format(formatString);
  const five = moment().startOf("month").add(5, "months").format(formatString);
  const six = moment().startOf("month").add(6, "months").format(formatString);

  const intervals = [
    { a: init, b: one },
    { a: one, b: two },
    { a: two, b: three },
    { a: three, b: four },
    { a: four, b: five },
    { a: five, b: six },
  ];

  const periodicActive = intervals.map((interval) => {
    const selectedActiveInterval = activeAutopaysEvents.filter((activeAutopaysEvent) =>
      moment(activeAutopaysEvent?.ScheduleDate).isBetween(interval.a, interval.b, "day", "[)")
    );
    return selectedActiveInterval;
  });
  const periodicSuspended = intervals.map((interval) => {
    const selectedSuspendedInterval = suspendedAutopaysEvents.filter((suspendedAutopaysEvent) =>
      moment(suspendedAutopaysEvent?.ScheduleDate).isBetween(interval.a, interval.b, "day", "[)")
    );
    return selectedSuspendedInterval;
  });

  const rowObject = intervals.map((interval, index) => {
    const month = moment(interval.a).format("MMM YYYY");
    const active = periodicActive[index].reduce((accumulatorActive, currentValue) => {
      const sum = accumulatorActive + currentValue.ChargeAmount;
      return sum;
    }, 0);
    const suspended = periodicSuspended[index].reduce((accumulatorSus, currentValue) => {
      const sum = accumulatorSus + currentValue.ChargeAmount;
      return sum;
    }, 0);

    return { month, active, suspended };
  });

  const accountBalanceColumns: GridColDef[] = [
    {
      field: "month",
      headerName: "Monthly",
      width: 200,
      editable: false,
    },
    {
      field: "active",
      headerName: "Autopay Billing",
      width: 150,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.active).toFixed(2)}`,
      align: "right",
    },
    {
      field: "suspended",
      headerName: "Autopay Suspension",
      width: 150,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.suspended).toFixed(2)}`,
      align: "right",
    },
  ];

  return {
    columnsData: accountBalanceColumns,
    rowsData: rowObject,
  };
};
