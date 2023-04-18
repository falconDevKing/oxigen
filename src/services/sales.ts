import dynamic from "next/dynamic";
import { complexObject, numberObject, simpleObject } from "./memberships";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridValueGetterParams } from "@mui/x-data-grid";
import moment from "moment";

const filterServicesSales = (salesData: any[]) => {
  const purchasedServicesItems: any[] = salesData.reduce((accumulator, currentValue) => {
    const added: any[] = [];
    const purchasedItemsArray: any[] = currentValue.PurchasedItems;
    purchasedItemsArray.forEach((purchasedItem) => {
      if (purchasedItem.IsService) {
        const id: string = purchasedItem.Id;
        const taxAmount: number = purchasedItem.TaxAmount;
        const totalAmount: number = purchasedItem.TotalAmount;

        added.push({ id, taxAmount, totalAmount });
      }
    });
    return [...accumulator, ...added];
  }, []);

  return purchasedServicesItems;
};

const getTaxAndTotal = (purchasedServicesItems: any[]) => {
  const taxAndTotalSum = purchasedServicesItems.reduce(
    (accumulator, currentValue) => {
      const { taxAmount: initTax, totalAmount: initTotal } = accumulator;
      const { taxAmount: currentTax, totalAmount: currentTotal } = currentValue;

      return { taxAmount: initTax + currentTax, totalAmount: initTotal + currentTotal };
    },
    { taxAmount: 0, totalAmount: 0 }
  );

  return taxAndTotalSum;
};

const groupBy = (objectArray: any[], property: string) => {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
};

const createPeriodicSalesByServices = (salesData: any[], servicesData: any[], startDate: string) => {
  const purchasedServicesItems = filterServicesSales(salesData);

  const groupedPurchaseServicesItems: complexObject = groupBy(purchasedServicesItems, "id");

  const servicesId = Object.keys(groupedPurchaseServicesItems);

  const getServiceCategoryName: (serviceId: string) => string = (serviceId: string) =>
    servicesData.find((service) => service.ProductId === +serviceId)?.Program ?? "Uncategorised";

  const servicesObject: simpleObject = servicesId.reduce((accum: numberObject, serviceId) => {
    const serviceCategory = getServiceCategoryName(serviceId);
    const serviceIdValue: any[] = groupedPurchaseServicesItems[serviceId];

    const serviceIdTotal: number = serviceIdValue.reduce((acc, currVal) => acc + currVal.totalAmount, 0);

    const key = serviceCategory;
    const currentServiceCategoryValue = accum[key] ?? 0;

    return { ...accum, [key]: currentServiceCategoryValue + serviceIdTotal };
  }, {});

  const taxAndTotalSum = getTaxAndTotal(purchasedServicesItems);

  const initialRowObject: simpleObject = {
    month: moment(startDate).format("MMM YYYY"),
  };

  const incomeRowObject: simpleObject = {
    incomeExTax: taxAndTotalSum.totalAmount - taxAndTotalSum.taxAmount,
    incomeIncTax: taxAndTotalSum.totalAmount,
  };

  const dynamicColumns = Object.keys(servicesObject);
  const updatedRowObject = Object.assign(initialRowObject, servicesObject, incomeRowObject);

  return {
    columnsKeys: dynamicColumns,
    rowsData: updatedRowObject,
  };
};

type salesPeriod = {
  a: string;
  b: string;
};

export const createSalesByServices = (salesData: any[], servicesData: any[], salesPeriod: salesPeriod[]) => {
  const salesTableData = salesData.map((saleData, index) => {
    const saleDataResult = createPeriodicSalesByServices(saleData, servicesData, salesPeriod[index].a);
    return saleDataResult;
  });

  const salesTableColumns = salesTableData.map((saleTableData) => saleTableData.columnsKeys).flat();
  const uniqueSalesTableColumns = Array.from(new Set(salesTableColumns));

  const dynamicColumns: GridColDef[] = uniqueSalesTableColumns
    .filter((service) => service !== "Uncategorised")
    .map((column) => ({
      field: column,
      headerName: column,
      width: 200,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => {
        return Number(params.row[column]) ? `$${Number(params.row[column]).toFixed(2)}` : "$0.00";
      },
    }));

  const salesByServiceColumns: GridColDef[] = [
    {
      field: "month",
      headerName: "Monthly",
      width: 200,
      editable: false,
    },
    ...dynamicColumns,
    {
      field: "Uncategorised",
      headerName: "Uncategorised",
      width: 200,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.Uncategorised).toFixed(2)}`,
    },
    {
      field: "incomeExTax",
      headerName: "Total Income Ex. Tax",
      width: 200,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.incomeExTax).toFixed(2)}`,
    },
    {
      field: "incomeIncTax",
      headerName: "Total Income Inc. Tax",
      width: 200,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `$${Number(params.row.incomeIncTax).toFixed(2)}`,
    },
  ];

  const tableRowObject = salesTableData.map((saleTableData) => saleTableData.rowsData);

  return {
    columnsData: salesByServiceColumns,
    rowsData: tableRowObject,
  };
};
