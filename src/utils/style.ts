import { makeStyles } from "@mui/styles";
import theme from "utils/theme";

export const useStyles = makeStyles({
  input: {
    "& .MuiFilledInput-root": {
      minHeight: "80px",
      paddingTop: "40px",
      border: "1px solid #BBBEC2",
    },
    "&  .MuiFilledInput-root.Mui-error": {
      border: "2px solid #A73636",
    },
  },
  numberInput: {
    "& .MuiFilledInput-root": {
      border: "1px solid #BBBEC2",
    },
    "&:focus": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    "& .MuiInputBase-input.Mui-error": {
      border: "2px solid #A73636",
    },
    "&  .MuiFilledInput-root.Mui-error": {
      border: "2px solid #A73636",
    },
  },
  secondInput: {
    "& .MuiInputBase-input": {
      border: "1px solid #BBBEC2",
      "& .Mui-error": {
        border: "2px solid #A73636",
      },
    },
    "&:focus": {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },
  label: {
    color: "#8083A3",
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    marginTop: "2px",
    border: "none !important",
  },
  placeholder: {
    color: "#8083A3",
    fontWeight: "500",
    lineHeight: "18px",
  },
  submitButton: {
    backgroundColor: "#FBA34B",
    textTransform: "none",
    boxShadow: "none",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    color: "#3D1E01",
    lineHeight: "1.25rem",
    fontSize: "0.875rem",
    margin: "1rem 0",
    "&:hover": {
      backgroundColor: "#FFBC79",
      boxShadow: "none",
    },
  },
  outlineButton: {
    backgroundColor: "white",
    textTransform: "none",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #BBBEC2",
    boxShadow: "none",
    color: "#3D1E01",
    lineHeight: "1.25rem",
    fontSize: "0.875rem",
    margin: "1rem 0",
    "&:hover": {
      background: " #F2F3F7",
      boxShadow: "none",
    },
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: "#101840",
  },
  otherInput: {
    "& .MuiFilledInput-root": {
      border: "1px solid #BBBEC2",
      "&::placeholder": {
        color: "#8083A3 !important",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      marginTop: "-12px !important",
      "&::placeholder": {
        color: "#8083A3 !important",
        opacity: 1,
        fontWeight: 600,
      },
    },
    "& .MuiInputBase-input.Mui-error": {
      border: "2px solid #A73636",
    },
    "&  .MuiFilledInput-root.Mui-error": {
      border: "2px solid #A73636",
    },
  },
  title: {
    color: "#000",
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "24px",
  },
  subTitle: {
    color: "#000",
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "16px",
  },
});
