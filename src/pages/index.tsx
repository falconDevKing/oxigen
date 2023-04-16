import React, { useRef, useState } from "react";
import type { GetServerSideProps } from "next";
import { Box, Grid, Typography } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "components/Input";
import { LoadingButton } from "@mui/lab";
import { useStyles } from "utils/style";
import SuccessHandler from "utils/SuccessHandler";
import ErrorHandler from "utils/ErrorHandler";
import LoadingHandler, { DismissHandler } from "utils/LoadingHandler";
import { SelectChangeEvent } from "@mui/material/Select";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupedSelectInput from "components/GroupedSelect";
import Table from "components/Table";

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

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    LoadingHandler({ message: "Uploading Files" });

    try {
      //
    } catch (err) {
      console.log("Error:", err);
      ErrorHandler({ message: "Error in processing" });
    }
  };

  return (
    <Grid item textAlign="center" width={"100%"} margin="0px auto" height="100vh">
      <h1>Welcome to Oxigen Demo Page </h1>

      <h3>Kindly select your report type</h3>

      <Grid item textAlign="center" width={"90%"} margin={"0px auto"}>
        {/* {<Table data={data as filesData[]} />} */}
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
