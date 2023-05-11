import React, { useState, useEffect, useMemo } from "react";
import type { GetServerSideProps } from "next";
import { Box, Grid, Button } from "@mui/material";
import Table from "components/Table";
import axios from "axios";
import { createMembershipTableData } from "services/memberships";
import { createAccountBalance } from "services/accountBalance";
import { createSalesByServices } from "services/sales";
import { createAutoPay } from "services/autopay";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import DataStatus from "components/dataStatus";
import DisplayButton from "components/displayButton";
import networkData from "utils/tempData";

const Home = (props: { authToken: string; clientsData: any[]; membershipsData: any[]; servicesData: any[] }) => {
  const { authToken, clientsData, membershipsData, servicesData } = props;

  console.log("clients", clientsData);
  // if (typeof window !== "undefined") {
  //   localStorage.setItem("AuthToken", authToken);
  // }

  const [display, setDisplay] = useState<string>("membership");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [accountsBalanceData, setAccountsBalanceData] = useState<any[]>([]);
  const [activeClientsMemberships, setActiveClientsMemberships] = useState<number[]>([]);
  const [clientsContracts, setClientsContracts] = useState<number[]>([]);
  const [completeData, setCompleteData] = useState<number[]>([]);
  const [clientVisitData, setClientVisitData] = useState<number[]>([]);

  const [clientVisitLoading, setClientVisitLoading] = useState<boolean>(false);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [accountsBalanceLoading, setAccountsBalanceLoading] = useState<boolean>(false);
  const [activeClientsMembershipsLoading, setActiveClientsMembershipsLoading] = useState<boolean>(false);
  const [autopayLoading, setAutopayLoading] = useState<boolean>(false);

  const formatString = "YYYY-MM-DDTHH:mm:ss[Z]";
  // const one = moment().startOf("month").subtract(6, "months").format(formatString);
  // const two = moment().startOf("month").subtract(5, "months").format(formatString);
  // const three = moment().startOf("month").subtract(4, "months").format(formatString);
  // const four = moment().startOf("month").subtract(3, "months").format(formatString);
  // const five = moment().startOf("month").subtract(2, "months").format(formatString);
  // const six = moment().startOf("month").subtract(1, "months").format(formatString);
  // const seven = moment().startOf("month").format(formatString);

  // const intervals = useMemo(
  //   () => [
  //     { a: one, b: two },
  //     { a: two, b: three },
  //     { a: three, b: four },
  //     { a: four, b: five },
  //     { a: five, b: six },
  //     { a: six, b: seven },
  //   ],
  //   [five, four, one, seven, six, three, two]
  // );

  // const { columnsData: membershipColumns, rowsData: membershipRowData } = createMembershipTableData(clientsData, membershipsData, activeClientsMemberships);
  // const { columnsData: accountBalanceColumns, rowsData: accountBalanceRowData } = createAccountBalance(accountsBalanceData, intervals);
  // const { columnsData: salesByServicesColumns, rowsData: salesByServicesRowData } = createSalesByServices(salesData, servicesData, intervals);
  // const { columnsData: autoPayColumns, rowsData: autoPayRowData } = createAutoPay(clientsContracts);

  // useEffect(() => {
  //   console.log("authToken", authToken);
  //   const getActiveClientsUniqueMembershipIds = async (clientsIds: string) => {
  //     const clientIdsArray = (clientsIds as string).split(",");
  //     const offsetMax = clientIdsArray.length;
  //     let offsetValue = 0;

  //     const groupedIds: string[] = [];

  //     const groupIds = () => {
  //       const selectedIds = clientIdsArray.slice(offsetValue, offsetValue + 200).join(",");
  //       groupedIds.push(selectedIds);
  //       offsetValue += 200;

  //       if (offsetValue < offsetMax) {
  //         groupIds();
  //       }
  //     };
  //     groupIds();

  //     const groupedClientMemberships = await Promise.allSettled(
  //       groupedIds.map(async (groupedId) => {
  //         const getActiveClientMembershipsIds = await axios.get("/api/fetchActiveClientMemberships", {
  //           params: { clientsIds: groupedId },
  //           headers: { Authorization: authToken },
  //         });
  //         const activeClientMembershipsIds: number[] = getActiveClientMembershipsIds.data.data;

  //         return activeClientMembershipsIds;
  //       })
  //     );

  //     const combinedClientMembershipValues = groupedClientMemberships.map((value) => (value?.status === "fulfilled" ? value?.value : [])).flat();

  //     return combinedClientMembershipValues;
  //   };

  //   const getSalesPeriodData = async (a: string, b: string) => {
  //     try {
  //       const getPeriodSales = await axios.get("/api/fetchSales", {
  //         params: {
  //           startSaleDateTime: a,
  //           endSaleDateTime: b,
  //         },
  //         headers: { Authorization: authToken },
  //       });
  //       const salesPeriodData = getPeriodSales?.data?.data;
  //       return salesPeriodData;
  //     } catch (err) {
  //       console.log("Sales Period Error:", err);
  //     }
  //   };

  //   const getAccountBalancePeriodicData = async (monthEnd: string) => {
  //     try {
  //       const clientsIds = clientsData.map((client) => client.Id).join(",");

  //       const getPeriodAccountBalance = await axios.get("/api/fetchAccountBalance", {
  //         params: {
  //           clientsIds: clientsIds,
  //           balanceDate: monthEnd,
  //         },
  //         headers: { Authorization: authToken },
  //       });
  //       const accountBalancePeriodData = getPeriodAccountBalance?.data?.data;
  //       return accountBalancePeriodData;
  //     } catch (err) {
  //       console.log("AccountBalance Period Error:", err);
  //     }
  //   };

  //   const getClientContracts = async (clientId: string) => {
  //     const getClientContractsResponse = await axios.get("/api/fetchClientContracts", {
  //       params: {
  //         clientId: clientId,
  //       },
  //       headers: { Authorization: authToken },
  //     });
  //     const clientContracts = getClientContractsResponse?.data?.data;
  //     return clientContracts;
  //   };

  //   const getCombinedClientsContracts = async () => {
  //     setAutopayLoading(true);
  //     const clientsIds = clientsData.map((client) => client.Id);

  //     const combinedClientsContractsData = await Promise.allSettled(
  //       clientsIds.map(async (clientId) => {
  //         const clientContracts = await getClientContracts(clientId);
  //         return clientContracts;
  //       })
  //     );
  //     const combinedClientsContractsDataValues = combinedClientsContractsData.map((value) => (value?.status === "fulfilled" ? value?.value : []));

  //     setClientsContracts(combinedClientsContractsDataValues);
  //     setAutopayLoading(false);
  //   };

  //   const getCombinedActiveClientsUniqueMembershipIds = async () => {
  //     setActiveClientsMembershipsLoading(true);
  //     const clientsIds = clientsData.map((client) => client.Id).join(",");

  //     const combinedActiveClientsUniqueMembershipIds = await getActiveClientsUniqueMembershipIds(clientsIds);

  //     setActiveClientsMemberships(combinedActiveClientsUniqueMembershipIds);
  //     setActiveClientsMembershipsLoading(false);
  //   };

  //   const getSalesData = async () => {
  //     try {
  //       setSalesLoading(true);
  //       const combinedSalesData = await Promise.allSettled(
  //         intervals.map(async (interval) => {
  //           const salePeriodData = await getSalesPeriodData(interval.a, interval.b);
  //           return salePeriodData;
  //         })
  //       );
  //       const combinedSalesDataValues = combinedSalesData.map((value) => (value?.status === "fulfilled" ? value?.value : []));
  //       setSalesData(combinedSalesDataValues);
  //       setSalesLoading(false);
  //     } catch (err) {
  //       console.log("Sales Error:", err);
  //     }
  //   };

  //   const getAccountBalanceData = async () => {
  //     try {
  //       setAccountsBalanceLoading(true);
  //       const combinedAccountBalanceData = await Promise.allSettled(
  //         intervals.map(async (interval) => {
  //           const accountBalancePeriodData = await getAccountBalancePeriodicData(interval.b);
  //           return accountBalancePeriodData;
  //         })
  //       );
  //       const combinedAccountBalanceDataValues = combinedAccountBalanceData.map((value) => (value?.status === "fulfilled" ? value?.value : []));
  //       setAccountsBalanceData(combinedAccountBalanceDataValues);
  //       setAccountsBalanceLoading(false);
  //     } catch (err) {
  //       console.log("AccountBalance Error:", err);
  //     }
  //   };

  //   // getCombinedActiveClientsUniqueMembershipIds();
  //   // getSalesData();
  //   // getAccountBalanceData();
  //   // getCombinedClientsContracts();
  // }, [authToken, clientsData, intervals]);

  const monthBegin = "2023-04-01T00:00:00Z";
  // const monthBegin = moment().startOf("month").format(formatString);
  const previousWeekBegin = moment().startOf("week").subtract(3, "weeks").format(formatString);
  const weekBegin = moment().startOf("week").subtract(2, "weeks").format(formatString);

  // const getCompleteClientInfo = async (clientId: string) => {
  //   const getCompleteClientInfoResponse = await axios.get("/api/fetchCompleteClientInfo", {
  //     params: {
  //       clientId: clientId,
  //       startDate: monthBegin,
  //       endDate: weekBegin,
  //     },
  //     headers: { Authorization: authToken },
  //   });
  //   const completeClientInfo = getCompleteClientInfoResponse?.data?.data;
  //   return completeClientInfo;
  // };

  // const getCombinedCompleteClientInfo = async () => {
  //   setCompleteLoading(true);
  //   // const clientsIds = clientsData.map((client) => client.Id);

  //   const combinedCompleteClientInfoData = await Promise.allSettled(
  //     networkData.map(async (clientId) => {
  //       const completeClientInfo = await getCompleteClientInfo(clientId);
  //       return completeClientInfo;
  //     })
  //   );
  //   const combinedCompleteClientInfoDataValues = combinedCompleteClientInfoData.map((value) => (value?.status === "fulfilled" ? value?.value : []));

  //   setCompleteData(combinedCompleteClientInfoDataValues);
  //   setCompleteLoading(false);
  //   console.log("completeClient", combinedCompleteClientInfoDataValues);
  // };

  const getClientVisits = async (clientId: string) => {
    const getClientVisitsResponse = await axios.get("/api/fetchClientVisits", {
      params: {
        clientId: clientId,
        startDate: monthBegin,
        endDate: weekBegin,
        unpaidsOnly: true,
      },
      headers: { Authorization: authToken },
    });
    const ClientVisits = getClientVisitsResponse?.data?.data;
    return ClientVisits;
  };

  const getCombinedClientVisits = async () => {
    setClientVisitLoading(true);
    // const clientsIds = clientsData.map((client) => client.Id);

    const combinedClientVisitsData = await Promise.allSettled(
      networkData.map(async (clientId) => {
        const ClientVisits = await getClientVisits(clientId);
        return ClientVisits;
      })
    );
    const combinedClientVisitsDataValues = combinedClientVisitsData.map((value) => (value?.status === "fulfilled" ? value?.value : []));

    setClientVisitData(combinedClientVisitsDataValues);
    setClientVisitLoading(false);
    console.log("ClientVisits", combinedClientVisitsDataValues);
  };

  const setDisplayHandler = (value: string) => {
    setDisplay(value);
  };

  return (
    <>
      <Head>
        <title>Oxigen POC</title>
      </Head>
      <Grid container height="100vh">
        <Grid item md={3} lg={2} px={4} py={4} margin="0px auto">
          <Box mb={8}>
            <Image src={"/oxigen logo.gif"} alt={"Oxigen Logo"} width={200} height={50} />
          </Box>

          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"} height={"100%"} pt={8} pb={24}>
            <DisplayButton title={"MEMBERSHIP REPORT"} setText="membership" setDisplay={setDisplayHandler} />
            <DisplayButton title={"SALES BY SERVICE REPORT"} setText="sales" setDisplay={setDisplayHandler} />
            <DisplayButton title={"AUTOPAY SUMMARY REPORT"} setText="autopay" setDisplay={setDisplayHandler} />
            <DisplayButton title={"ACCOUNT BALANCE REPORT"} setText="account" setDisplay={setDisplayHandler} />
          </Box>
        </Grid>

        <Grid item md={9} lg={10} width={"100%"} px={8} py={2} margin="0px auto" height="100%">
          <Box textAlign="center">
            <h1>Welcome to Oxigen POC Page </h1>

            <h3>Kindly select your report type</h3>

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} p={2}>
              Data Fetching Status:
              <DataStatus title="Membership" loading={activeClientsMembershipsLoading} />
              <DataStatus title="Sales" loading={salesLoading} />
              <DataStatus title="AutoPay" loading={autopayLoading} />
              <DataStatus title="Accounts" loading={accountsBalanceLoading} />
            </Box>

            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} p={2}>
              {/* <Button variant={"contained"}>Fetch ClientsCompleteInfo</Button> */}
              <Button
                variant={"contained"}
                // onClick={getCombinedClientVisits}
              >
                Fetch Trial Clients Visit
              </Button>
              <Button variant={"contained"} onClick={getCombinedClientVisits}>
                Fetch Clients Visit
              </Button>
            </Box>
          </Box>

          {/* <Grid item textAlign="center" width={"90%"} margin={"8px auto"} display={display === "membership" ? "block" : "none"}>
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
          </Grid> */}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const serverUrl = process.env.SERVER_URL;
  const apiKey = process.env.API_KEY;
  const siteId = process.env.SITE_ID;
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  // const authTokenData = await axios.post(
  //   "https://api.mindbodyonline.com/public/v6/usertoken/issue",
  //   {
  //     username,
  //     password,
  //   },
  //   { headers: { "Content-Type": "application/json", "API-Key": apiKey, siteId: siteId } }
  // );
  // const authToken = "Bearer " + authTokenData.data.AccessToken;
  const authToken = "Bearer ";

  // const getClientsData = async () => {
  //   try {
  //     console.log("getClientscalled");
  //     const getClients = await axios.get(serverUrl + "/api/fetchClients", {
  //       headers: { Authorization: authToken },
  //     });
  //     const clientsData = getClients?.data?.data;
  //     return clientsData;
  //   } catch (err) {
  //     console.log("Client Error:", err);
  //   }
  // };

  // const getMembershipsData = async () => {
  //   try {
  //     console.log("getMembershipscalled");
  //     const getMemberships = await axios.get(serverUrl + "/api/fetchMemberships", {
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
  //     const getServices = await axios.get(serverUrl + "/api/fetchServices", {
  //       headers: { Authorization: authToken },
  //     });
  //     const servicesData = getServices?.data?.data;
  //     return servicesData;
  //   } catch (err) {
  //     console.log("Services Error:", err);
  //   }
  // };

  // const [clientsData, membershipsData, servicesData] = await Promise.allSettled([getClientsData(), getMembershipsData(), getServicesData()]);
  // const [clientsData] = await Promise.allSettled([getClientsData()]);

  // const clientsProps = clientsData.status === "fulfilled" ? clientsData.value : [];
  // const membershipsProps = membershipsData.status === "fulfilled" ? membershipsData.value : [];
  // const servicesProps = servicesData.status === "fulfilled" ? servicesData.value : [];
  const clientsProps: any[] = [];
  const membershipsProps: any[] = [];
  const servicesProps: any[] = [];

  return {
    props: {
      authToken: authToken,
      clientsData: clientsProps,
      membershipsData: membershipsProps,
      servicesData: servicesProps,
    },
  };
};
