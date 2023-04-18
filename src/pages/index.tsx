import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
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
import { createMembershipTableData, simpleObject } from "services/memberships";
import { createAccountBalance } from "services/accountBalance";
import { createSalesByServices } from "services/sales";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import DataStatus from "components/dataStatus";
import { createAutoPay } from "services/autopay";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const siteId = process.env.NEXT_PUBLIC_SITE_ID;

const Home = (props: { authToken: string; clientsData: any[]; membershipsData: any[]; servicesData: any[] }) => {
  const { authToken, clientsData, membershipsData, servicesData } = props;

  // if (typeof window !== "undefined") {
  //   localStorage.setItem("AuthToken", authToken);
  // }

  const [display, setDisplay] = useState<string>("membership");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [accountsBalanceData, setAccountsBalanceData] = useState<any[]>([]);
  const [activeClientsMemberships, setActiveClientsMemberships] = useState<number[]>([]);
  const [clientsContracts, setClientsContracts] = useState<number[]>([]);

  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [accountsBalanceLoading, setAccountsBalanceLoading] = useState<boolean>(false);
  const [activeClientsMembershipsLoading, setActiveClientsMembershipsLoading] = useState<boolean>(false);
  const [autopayLoading, setAutopayLoading] = useState<boolean>(false);

  const formatString = "YYYY-MM-DDThh:mm:ss[Z]";
  const one = moment().startOf("month").subtract(6, "months").format(formatString);
  const two = moment().startOf("month").subtract(5, "months").format(formatString);
  const three = moment().startOf("month").subtract(4, "months").format(formatString);
  const four = moment().startOf("month").subtract(3, "months").format(formatString);
  const five = moment().startOf("month").subtract(2, "months").format(formatString);
  const six = moment().startOf("month").subtract(1, "months").format(formatString);
  const seven = moment().startOf("month").format(formatString);

  const intervals = useMemo(
    () => [
      { a: one, b: two },
      { a: two, b: three },
      { a: three, b: four },
      { a: four, b: five },
      { a: five, b: six },
      { a: six, b: seven },
    ],
    [five, four, one, seven, six, three, two]
  );

  const { columnsData: membershipColumns, rowsData: membershipRowData } = createMembershipTableData(clientsData, membershipsData, activeClientsMemberships);
  const { columnsData: accountBalanceColumns, rowsData: accountBalanceRowData } = createAccountBalance(accountsBalanceData, intervals);
  const { columnsData: salesByServicesColumns, rowsData: salesByServicesRowData } = createSalesByServices(salesData, servicesData, intervals);
  const { columnsData: autoPayColumns, rowsData: autoPayRowData } = createAutoPay(clientsContracts);

  useEffect(() => {
    console.log("authToken", authToken);
    const getActiveClientsUniqueMembershipIds = async (clientsIds: string) => {
      const clientIdsArray = (clientsIds as string).split(",");
      const offsetMax = clientIdsArray.length;
      let offsetValue = 0;

      const groupedIds: string[] = [];

      const groupIds = () => {
        const selectedIds = clientIdsArray.slice(offsetValue, offsetValue + 200).join(",");
        groupedIds.push(selectedIds);
        offsetValue += 200;

        if (offsetValue < offsetMax) {
          groupIds();
        }
      };
      groupIds();

      const groupedClientMemberships = await Promise.allSettled(
        groupedIds.map(async (groupedId) => {
          const getActiveClientMembershipsIds = await axios.get("/api/fetchActiveClientMemberships", {
            params: { clientsIds: groupedId },
            headers: { Authorization: authToken },
          });
          const activeClientMembershipsIds: number[] = getActiveClientMembershipsIds.data.data;

          return activeClientMembershipsIds;
        })
      );

      const combinedClientMembershipValues = groupedClientMemberships.map((value) => (value?.status === "fulfilled" ? value?.value : [])).flat();

      return combinedClientMembershipValues;
    };

    const getSalesPeriodData = async (a: string, b: string) => {
      try {
        const getPeriodSales = await axios.get("/api/fetchSales", {
          params: {
            startSaleDateTime: a,
            endSaleDateTime: b,
          },
          headers: { Authorization: authToken },
        });
        const salesPeriodData = getPeriodSales?.data?.data;
        return salesPeriodData;
      } catch (err) {
        console.log("Sales Period Error:", err);
        ErrorHandler({ message: "Error fetching Sales Period" });
      }
    };

    const getAccountBalancePeriodicData = async (monthEnd: string) => {
      try {
        const clientsIds = clientsData.map((client) => client.Id).join(",");

        const getPeriodAccountBalance = await axios.get("/api/fetchAccountBalance", {
          params: {
            clientsIds: clientsIds,
            balanceDate: monthEnd,
          },
          headers: { Authorization: authToken },
        });
        const accountBalancePeriodData = getPeriodAccountBalance?.data?.data;
        return accountBalancePeriodData;
      } catch (err) {
        console.log("AccountBalance Period Error:", err);
        ErrorHandler({ message: "Error fetching AccountBalance Period" });
      }
    };

    const getClientContracts = async (clientId: string) => {
      const getClientContractsResponse = await axios.get("/api/fetchClientContracts", {
        params: {
          clientId: clientId,
        },
        headers: { Authorization: authToken },
      });
      const clientContracts = getClientContractsResponse?.data?.data;
      return clientContracts;
    };

    const getCombinedClientsContracts = async () => {
      setAutopayLoading(true);
      const clientsIds = clientsData.map((client) => client.Id);

      const combinedClientsContractsData = await Promise.allSettled(
        clientsIds.map(async (clientId) => {
          const clientContracts = await getClientContracts(clientId);
          return clientContracts;
        })
      );
      const combinedClientsContractsDataValues = combinedClientsContractsData.map((value) => (value?.status === "fulfilled" ? value?.value : []));

      setClientsContracts(combinedClientsContractsDataValues);
      setAutopayLoading(false);
    };

    const getCombinedActiveClientsUniqueMembershipIds = async () => {
      setActiveClientsMembershipsLoading(true);
      const clientsIds = clientsData.map((client) => client.Id).join(",");

      const combinedActiveClientsUniqueMembershipIds = await getActiveClientsUniqueMembershipIds(clientsIds);

      setActiveClientsMemberships(combinedActiveClientsUniqueMembershipIds);
      setActiveClientsMembershipsLoading(false);
    };

    const getSalesData = async () => {
      try {
        setSalesLoading(true);
        const combinedSalesData = await Promise.allSettled(
          intervals.map(async (interval) => {
            const salePeriodData = await getSalesPeriodData(interval.a, interval.b);
            return salePeriodData;
          })
        );
        const combinedSalesDataValues = combinedSalesData.map((value) => (value?.status === "fulfilled" ? value?.value : []));
        setSalesData(combinedSalesDataValues);
        setSalesLoading(false);
      } catch (err) {
        console.log("Sales Error:", err);
        ErrorHandler({ message: "Error fetching Sales" });
      }
    };

    const getAccountBalanceData = async () => {
      try {
        setAccountsBalanceLoading(true);
        const combinedAccountBalanceData = await Promise.allSettled(
          intervals.map(async (interval) => {
            const accountBalancePeriodData = await getAccountBalancePeriodicData(interval.b);
            return accountBalancePeriodData;
          })
        );
        const combinedAccountBalanceDataValues = combinedAccountBalanceData.map((value) => (value?.status === "fulfilled" ? value?.value : []));
        setAccountsBalanceData(combinedAccountBalanceDataValues);
        setAccountsBalanceLoading(false);
      } catch (err) {
        console.log("AccountBalance Error:", err);
        ErrorHandler({ message: "Error fetching AccountBalance" });
      }
    };

    // getCombinedActiveClientsUniqueMembershipIds();
    // getSalesData();
    // getAccountBalanceData();
    // getCombinedClientsContracts();
  }, [authToken, clientsData, intervals]);

  return (
    <>
      <Head>
        <title>Oxigen Demo</title>
      </Head>
      <Grid container height="100vh">
        <Grid item md={3} lg={2} px={4} py={4} margin="0px auto">
          <Box mb={8}>
            <Image src={"/oxigen logo.gif"} alt={"Oxigen Logo"} width={200} height={50} />
          </Box>

          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"} height={"100%"} pt={8} pb={24}>
            <Button variant="contained" onClick={() => setDisplay("membership")} sx={{ borderRadius: "0 32px 0 32px" }}>
              MEMBERSHIP REPORT
            </Button>
            <Button variant="contained" onClick={() => setDisplay("sales")} sx={{ borderRadius: "0 32px 0 32px" }}>
              SALES BY SERVICE REPORT
            </Button>
            <Button variant="contained" onClick={() => setDisplay("account")} sx={{ borderRadius: "0 32px 0 32px" }}>
              ACCOUNT BALANCE REPORT
            </Button>
            <Button variant="contained" onClick={() => setDisplay("autopay")} sx={{ borderRadius: "0 32px 0 32px" }}>
              AUTOPAY SUMMARY REPORT
            </Button>
          </Box>
        </Grid>

        <Grid item md={9} lg={10} width={"100%"} px={8} py={2} margin="0px auto" height="100%">
          <Box textAlign="center">
            <h1>Welcome to Oxigen Demo Page </h1>

            <h3>Kindly select your report type</h3>

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} p={2}>
              Data Fetching Status:
              <DataStatus title="Membership" loading={activeClientsMembershipsLoading} />
              <DataStatus title="Sales" loading={salesLoading} />
              <DataStatus title="AutoPay" loading={autopayLoading} />
              <DataStatus title="Accounts" loading={accountsBalanceLoading} />
            </Box>
          </Box>

          <Grid item textAlign="center" width={"90%"} margin={"8px auto"} display={display === "membership" ? "block" : "none"}>
            <Table data={membershipRowData} dynamicColumns={membershipColumns} title={"Membership Report"} loading={activeClientsMembershipsLoading} />
          </Grid>
          <Grid item textAlign="center" width={"90%"} margin={"8px auto"} display={display === "account" ? "block" : "none"}>
            <Table data={accountBalanceRowData} dynamicColumns={accountBalanceColumns} title={"AccountBalance Report"} loading={accountsBalanceLoading} />
          </Grid>
          <Grid item textAlign="center" width={"90%"} margin={"8px auto"} display={display === "sales" ? "block" : "none"}>
            <Table data={salesByServicesRowData} dynamicColumns={salesByServicesColumns} title={"Sales By Services Report"} loading={salesLoading} />
          </Grid>
          <Grid item textAlign="center" width={"90%"} margin={"8px auto"} display={display === "autopay" ? "block" : "none"}>
            <Table data={autoPayRowData} dynamicColumns={autoPayColumns} title={"Autopay Summary Report"} loading={autopayLoading} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const authTokenData = await axios.post(
    "https://api.mindbodyonline.com/public/v6/usertoken/issue",
    {
      username: "Siteowner",
      password: "apitest1234",
    },
    { headers: { "Content-Type": "application/json", "API-Key": apiKey, siteId: siteId } }
  );

  const authToken = "Bearer " + authTokenData.data.AccessToken;
  console.log("ssrauth", authToken);

  const getClientsData = async () => {
    try {
      console.log("getClientscalled");
      const getClients = await axios.get("http://localhost:3000/api/fetchClients", {
        headers: { Authorization: authToken },
      });
      const clientsData = getClients?.data?.data;
      return clientsData;
    } catch (err) {
      console.log("Client Error:", err);
    }
  };

  // const getMembershipsData = async () => {
  //   try {
  //     console.log("getMembershipscalled");
  //     const getMemberships = await axios.get("http://localhost:3000/api/fetchMemberships", {
  //       headers: { Authorization: authToken },
  //     });
  //     const membershipsData = getMemberships?.data?.data;
  //     return membershipsData;
  //   } catch (err) {
  //     console.log("Membership Error:", err);
  //   }
  // };

  // const getServicesData = async () => {
  //   try {
  //     console.log("getServicescalled");
  //     const getServices = await axios.get("http://localhost:3000/api/fetchServices", {
  //       headers: { Authorization: authToken },
  //     });
  //     const servicesData = getServices?.data?.data;
  //     return servicesData;
  //   } catch (err) {
  //     console.log("Services Error:", err);
  //   }
  // };

  // const [clientsData, membershipsData, servicesData] = await Promise.allSettled([getClientsData(), getMembershipsData(), getServicesData()]);
  const [clientsData] = await Promise.allSettled([getClientsData()]);

  const clientsProps = clientsData.status === "fulfilled" ? clientsData.value : [];
  // const membershipsProps = membershipsData.status === "fulfilled" ? membershipsData.value : [];
  // const servicesProps = servicesData.status === "fulfilled" ? servicesData.value : [];

  return {
    props: {
      authToken: authToken,
      clientsData: clientsProps,
      membershipsData: [],
      servicesData: [],
      // membershipsData: membershipsProps,
      // servicesData: servicesProps,
    },
  };
};
