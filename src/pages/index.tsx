import React, { useRef, useState, useEffect } from "react";
import type { GetServerSideProps } from "next";
import { Box, Button, Grid, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "components/Input";
// import { LoadingButton } from "@mui/lab";
import { useStyles } from "utils/style";
import SuccessHandler from "utils/SuccessHandler";
import ErrorHandler from "utils/ErrorHandler";
import LoadingHandler, { DismissHandler } from "utils/LoadingHandler";
import { SelectChangeEvent } from "@mui/material/Select";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupedSelectInput from "components/GroupedSelect";
import Table from "components/Table";
import axios from "axios";
import { createMembershipTableData, getActiveClientsUniqueMembershipIds, simpleObject } from "services/memberships";
import { createAccountBalance } from "services/accountBalance";
import { createSalesByServices } from "services/sales";
import moment from "moment";

type filesData = {
  id: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  processingBank: string;
  metaDate: any[];
};

type homeProps = {
  data: filesData[];
};

const Home = (props: homeProps) => {
  const classes = useStyles();
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [membershipsData, setMembershipsData] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [accountsBalanceLoading, setAccountsBalanceLoading] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [accountsBalanceData, setAccountsBalanceData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [activeClientsMemberships, setActiveClientsMemberships] = useState<number[]>([]);

  const formatString = "YYYY-MM-DDThh:mm:ss[Z]";
  const one = moment().startOf("month").subtract(6, "months").format(formatString);
  const two = moment().startOf("month").subtract(5, "months").format(formatString);
  const three = moment().startOf("month").subtract(4, "months").format(formatString);
  const four = moment().startOf("month").subtract(3, "months").format(formatString);
  const five = moment().startOf("month").subtract(2, "months").format(formatString);
  const six = moment().startOf("month").subtract(1, "months").format(formatString);
  const seven = moment().startOf("month").format(formatString);

  const getClientsData = async () => {
    try {
      const getClients = await axios.get("/api/fetchClients");
      const clientsData = getClients.data.data;
      setClientsData(clientsData);
      SuccessHandler({ message: "Fetched Clients" });
    } catch (err) {
      console.log("Client Error:", err);
      ErrorHandler({ message: "Error fetching clients" });
    }
  };

  const getMembershipsData = async () => {
    try {
      const getMemberships = await axios.get("/api/fetchMemberships");
      const membershipsData = getMemberships.data.data;
      setMembershipsData(membershipsData);
      SuccessHandler({ message: "Fetched Memberships" });
    } catch (err) {
      console.log("Membership Error:", err);
      ErrorHandler({ message: "Error fetching memberships" });
    }
  };

  const salesPeriod = [
    { a: one, b: two },
    { a: two, b: three },
    { a: three, b: four },
    { a: four, b: five },
    { a: five, b: six },
    { a: six, b: seven },
  ];

  const getSalesPeriodData = async (a: string, b: string) => {
    try {
      const getPeriodSales = await axios.get("/api/fetchSales", {
        params: {
          startSaleDateTime: a,
          endSaleDateTime: b,
        },
      });
      const salesPeriodData = getPeriodSales.data.data;
      return salesPeriodData;
    } catch (err) {
      console.log("Sales Period Error:", err);
      ErrorHandler({ message: "Error fetching Sales Period" });
    }
  };

  const getSalesData = async () => {
    try {
      setSalesLoading(true);
      const combinedSalesData = await Promise.allSettled(
        salesPeriod.map(async (salePeriod) => {
          const salePeriodData = await getSalesPeriodData(salePeriod.a, salePeriod.b);
          return salePeriodData;
        })
      );
      const combinedSalesDataValues = combinedSalesData.map((value) => value?.value ?? []);
      setSalesData(combinedSalesDataValues);
      SuccessHandler({ message: "Fetched Sales" });
      setSalesLoading(false);
    } catch (err) {
      console.log("Sales Error:", err);
      ErrorHandler({ message: "Error fetching Sales" });
    }
  };

  const getAccountBalancePeriodicData = async (monthEnd: string) => {
    try {
      const clientsIds = clientsData
        .map((client) => client.Id)
        // .filter((e, i) => i < 100)
        .join(",");
      console.log("cid", clientsIds);
      const getPeriodAccountBalance = await axios.get("/api/fetchAccountBalance", {
        params: {
          clientsIds: clientsIds,
          balanceDate: monthEnd,
        },
      });
      const accountBalancePeriodData = getPeriodAccountBalance.data.data;
      return accountBalancePeriodData;
    } catch (err) {
      console.log("AccountBalance Period Error:", err);
      ErrorHandler({ message: "Error fetching AccountBalance Period" });
    }
  };

  const getAccountBalanceData = async () => {
    try {
      setAccountsBalanceLoading(true);
      const combinedAccountBalanceData = await Promise.allSettled(
        salesPeriod.map(async (salePeriod) => {
          const accountBalancePeriodData = await getAccountBalancePeriodicData(salePeriod.b);
          return accountBalancePeriodData;
        })
      );
      const combinedAccountBalanceDataValues = combinedAccountBalanceData.map((value) => value?.value ?? []);
      setAccountsBalanceData(combinedAccountBalanceDataValues);
      SuccessHandler({ message: "Fetched AccountBalance" });
      setAccountsBalanceLoading(false);
    } catch (err) {
      console.log("AccountBalance Error:", err);
      ErrorHandler({ message: "Error fetching AccountBalance" });
    }
  };

  const getServicesData = async () => {
    try {
      const getServices = await axios.get("/api/fetchServices");
      const servicesData = getServices.data.data;
      setServicesData(servicesData);
      SuccessHandler({ message: "Fetched Services" });
    } catch (err) {
      console.log("Services Error:", err);
      ErrorHandler({ message: "Error fetching Services" });
    }
  };

  const getCombinedActiveClientsUniqueMembershipIds = async () => {
    const combinedActiveClientsUniqueMembershipIds = await Promise.all(
      clientsData.map(async (client) => {
        const activeClientsUniqueMembershipIds = await getActiveClientsUniqueMembershipIds(client.Id);

        return activeClientsUniqueMembershipIds;
      })
    );

    const flattenedCombinedActiveClientsUniqueMembershipIds = combinedActiveClientsUniqueMembershipIds.flat();
    setActiveClientsMemberships(flattenedCombinedActiveClientsUniqueMembershipIds);
  };

  const { columnsData: membershipColumns, rowsData: membershipRowData } = createMembershipTableData(clientsData, membershipsData, activeClientsMemberships);
  const { columnsData: accountBalanceColumns, rowsData: accountBalanceRowData } = createAccountBalance(accountsBalanceData, salesPeriod);
  const { columnsData: salesByServicesColumns, rowsData: salesByServicesRowData } = createSalesByServices(salesData, servicesData, salesPeriod);

  useEffect(() => {
    getClientsData();
    // getMembershipsData();
    // getServicesData();
  }, []);

  return (
    <Grid item width={"100%"} px={8} py={4} margin="0px auto" height="100vh">
      <Box textAlign="center" pb={8}>
        <h1>Welcome to Oxigen Demo Page </h1>

        <h3>Kindly view your report type</h3>
      </Box>

      <Button variant="contained" onClick={getCombinedActiveClientsUniqueMembershipIds}>
        GET ACTIVE MEMBERSHIPS
      </Button>
      <Button variant="contained" onClick={getSalesData}>
        Get Sales Data
      </Button>
      <Button variant="contained" onClick={getAccountBalanceData}>
        Get AccountBalance Data
      </Button>

      <Grid item width={"100%"} margin="8px auto">
        <Box>AUTOPAY SUMMARY</Box>
      </Grid>
      <Grid item textAlign="center" width={"90%"} margin={"8px auto"}>
        <Table data={[membershipRowData] as simpleObject[]} dynamicColumns={membershipColumns} title={"Membership Report"} />
      </Grid>
      <Grid item textAlign="center" width={"90%"} margin={"8px auto"}>
        <Table data={accountBalanceRowData} dynamicColumns={accountBalanceColumns} title={"AccountBalance Report"} loading={accountsBalanceLoading} />
      </Grid>
      <Grid item textAlign="center" width={"90%"} margin={"8px auto"}>
        <Table data={salesByServicesRowData} dynamicColumns={salesByServicesColumns} title={"Sales By Services Report"} loading={salesLoading} />
      </Grid>
    </Grid>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // let Dataset: AWS.DynamoDB.DocumentClient.ItemList;
  // try {
  //   const params = {
  //     TableName: TABLE,
  //   };

  //   const data = await ddbClient.scan(params).promise();
  //   Dataset = data?.Items ?? [];
  // } catch (err) {
  //   console.log("Error fetching ddb", err);
  //   Dataset = [];
  // }

  return {
    props: {
      // data: Dataset,
      data: true,
    },
  };
};
