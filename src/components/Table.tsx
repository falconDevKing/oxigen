import * as React from "react";
import AWS from "aws-sdk";
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
import { useMutation, useQueryClient } from "react-query";

const REGION = process.env.NEXT_PUBLIC_REGION as string;
const TABLE = process.env.NEXT_PUBLIC_TABLE || "flunaTextract";
const CREDENTIALS = {
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY_ID as string,
};

const ddbClient = new AWS.DynamoDB.DocumentClient({
  region: REGION,
  credentials: CREDENTIALS,
});

type dataType = {
  id: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  processingBank: string;
  metaDate: any[];
};

type tableProps = {
  data: dataType[];
};

const Table = ({ data }: tableProps) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [modalData, setModalData] = React.useState<any[]>([]);
  const [selectedData, setSelectedData] = React.useState<any[]>([]);
  const queryClient = useQueryClient();

  const modalCloser = () => setOpenModal(false);

  const deleteItems = async () => {
    try {
      const requestItems = selectedData.map((id) => {
        const request = {
          DeleteRequest: {
            Key: {
              id: id,
            },
          },
        };

        return request;
      });

      const params = {
        RequestItems: {
          [TABLE]: requestItems,
        },
      };

      await ddbClient.batchWrite(params).promise();
    } catch (error) {
      throw error;
    }
  };

  const DeleteMutation = useMutation(deleteItems, {
    onMutate: () => {
      LoadingHandler({ message: "Processing Request" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("dataset");
      DismissHandler();
      SuccessHandler({ message: "File(s) Deleted Successfully" });
    },
    onError: (error) => {
      DismissHandler();
      ErrorHandler({ message: "Error Deleting File(s)" });
      console.log("Error deleting file", error);
    },
  });

  const bankOptions = [
    { name: "Stanbic Bank", value: "Stanbic" },
    { name: "Consolidated Bank Ghana (CBG)", value: "CBG" },
    { name: "Ghana Commercial Bank (GCB)", value: "GCB" },
    { name: "Societe Generale Ghana (SGG)", value: "SGG" },
  ];

  const columns: GridColDef[] = [
    {
      field: "key",
      headerName: "File Name",
      width: 450,
      editable: false,
    },
    {
      field: "processingBank",
      headerName: "Bank",
      width: 250,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return bankOptions.filter((bank) => bank.value === params.row.processingBank)[0].name;
      },
    },
    {
      field: "updatedAt",
      headerName: "Processed Date",
      width: 250,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => format(new Date(params.row.updatedAt), "PP p"),
    },
    {
      field: "dummy",
      headerName: "Extra Information",
      width: 150,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setOpenModal(true);
              setModalData(params.row.metaData);
            }}
          >
            <SourceIcon />
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: "Actions",
      type: "number",
      width: 110,
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box display={"flex"} width={"100%"} justifyContent={"flex-end"} alignItems={"center"} sx={{ cursor: "pointer" }}>
            <DownloadFile fileName={params.row.key} />
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "400px",
        width: "100%",
      }}
    >
      <Box display={"flex"} padding={"8px"} mt={"32px"}>
        <Box flexBasis={"10%"} sx={{ cursor: "pointer" }}>
          {selectedData.length ? (
            <Box
              onClick={() => {
                DeleteMutation.mutate();
              }}
              display={"flex"}
              alignItems={"center"}
            >
              Delete File(s) &nbsp; <DeleteSweepIcon />
            </Box>
          ) : (
            ""
          )}
        </Box>
        <HeadingTwo flexBasis={"80%"} textAlign={"center"}>
          Processed Files
        </HeadingTwo>
      </Box>
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(rowSelectionModel: GridRowSelectionModel) => {
          setSelectedData(rowSelectionModel);
        }}
      />
      <MetadataInfo openModal={openModal} modalCloser={modalCloser} modalData={modalData} />
    </Box>
  );
};

export default Table;
