import * as React from "react";
// import AWS from "aws-sdk";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel, GridValueGetterParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import SourceIcon from "@mui/icons-material/Source";
import DownloadFile from "./downloadFIle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MetadataInfo from "./MetadataInfo";
import { HeadingTwo } from "components/Typography";
import LoadingHandler, { DismissHandler } from "utils/LoadingHandler";
import SuccessHandler from "utils/SuccessHandler";
import ErrorHandler from "utils/ErrorHandler";
// import { useMutation, useQueryClient } from "react-query";
import { simpleObject } from "services/memberships";

// const REGION = process.env.NEXT_PUBLIC_REGION as string;
// const TABLE = process.env.NEXT_PUBLIC_TABLE || "flunaTextract";
// const CREDENTIALS = {
//   accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
//   secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_ID as string,
// };

// const ddbClient = new AWS.DynamoDB.DocumentClient({
//   region: REGION,
//   credentials: CREDENTIALS,
// });

type tableProps = {
  data: simpleObject[];
  dynamicColumns: GridColDef[];
  title: string;
  loading?: boolean;
};

const Table = ({ data, dynamicColumns, title, loading }: tableProps) => {
  // const [openModal, setOpenModal] = React.useState<boolean>(false);
  // const [modalData, setModalData] = React.useState<any[]>([]);
  const [selectedData, setSelectedData] = React.useState<any[]>([]);
  // const queryClient = useQueryClient();

  // const modalCloser = () => setOpenModal(false);

  // const deleteItems = async () => {
  //   try {
  //     const requestItems = selectedData.map((id) => {
  //       const request = {
  //         DeleteRequest: {
  //           Key: {
  //             id: id,
  //           },
  //         },
  //       };

  //       return request;
  //     });

  //     const params = {
  //       RequestItems: {
  //         [TABLE]: requestItems,
  //       },
  //     };

  //     await ddbClient.batchWrite(params).promise();
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // const DeleteMutation = useMutation(deleteItems, {
  //   onMutate: () => {
  //     LoadingHandler({ message: "Processing Request" });
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("dataset");
  //     DismissHandler();
  //     SuccessHandler({ message: "File(s) Deleted Successfully" });
  //   },
  //   onError: (error) => {
  //     DismissHandler();
  //     ErrorHandler({ message: "Error Deleting File(s)" });
  //     console.log("Error deleting file", error);
  //   },
  // });

  // const bankOptions = [
  //   { name: "Stanbic Bank", value: "Stanbic" },
  //   { name: "Consolidated Bank Ghana (CBG)", value: "CBG" },
  //   { name: "Ghana Commercial Bank (GCB)", value: "GCB" },
  //   { name: "Societe Generale Ghana (SGG)", value: "SGG" },
  // ];

  return (
    <Box
      py={4}
      sx={{
        height: "500px",
        width: "100%",
      }}
    >
      <Box display={"flex"} padding={"8px"} mt={"32px"}>
        <HeadingTwo flexBasis={"100%"} textAlign={"center"}>
          {title}
        </HeadingTwo>
      </Box>
      <DataGrid
        columns={dynamicColumns}
        rows={data}
        getRowId={(row) => row.month}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[6, 12]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
          setSelectedData(rowSelectionModel);
        }}
      />
      {/* <MetadataInfo openModal={openModal} modalCloser={modalCloser} modalData={modalData} /> */}
    </Box>
  );
};

export default Table;
