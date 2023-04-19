import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PendingIcon from "@mui/icons-material/Pending";
import Box from "@mui/material/Box";

type DataStatusProps = {
  loading: boolean;
  title: string;
};

const DataStatus = ({ loading, title }: DataStatusProps) => {
  return (
    <Box display={"flex"} alignItems={"center"} px={2}>
      {loading ? <PendingIcon sx={{ color: "grey" }} /> : <TaskAltIcon sx={{ color: "green" }} />}
      <Box component="span" px={1}>
        {title}
      </Box>
    </Box>
  );
};

export default DataStatus;
