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
  const [activeClientsMemberships, setActiveClientsMemberships] = useState<number[]>([]);

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
  const { columnsData: accountBalanceColumns, rowsData: accountBalanceRowData } = createAccountBalance(clientsData);

  useEffect(() => {
    getClientsData();
    getMembershipsData();
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

      <Grid item width={"100%"} margin="8px auto">
        <Box>AUTOPAY SUMMARY</Box>

        <Box>SALES BY SERVICE</Box>
      </Grid>
      <Grid item textAlign="center" width={"90%"} margin={"8px auto"}>
        <Table data={[membershipRowData] as simpleObject[]} dynamicColumns={membershipColumns} title={"Membership Report"} />
      </Grid>
      <Grid item textAlign="center" width={"90%"} margin={"8px auto"}>
        <Table data={[accountBalanceRowData] as simpleObject[]} dynamicColumns={accountBalanceColumns} title={"AccountBalance Report"} />
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
