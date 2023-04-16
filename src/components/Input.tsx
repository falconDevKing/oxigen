import React from "react";
import { SxProps, Theme } from "@mui/material";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { OutlinedInputProps, TextFieldProps, Typography } from "@mui/material";
import { Modify } from "utils/modify";
export interface inputProps {
  margin?: "none" | "dense" | "normal" | undefined;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  name: string;
  placeholder?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string | number | React.ReactElement | undefined;
  dataTestId?: string;
  label?: string | React.ReactElement;
  error?: {
    [field: string]: any;
  };
  touched?: {
    [key: string]: any;
  };
  minHeight?: string;
  sx?: SxProps<Theme> | undefined;
  autoFocus?: boolean;
  ariaLabel?: string;
  id?: string;
  classes?: {
    [key: string]: string;
  };
  disabled?: boolean;
  multiline?: boolean;
  readOnly?: boolean;
  rows?: number;
  maxRows?: number;
  className?: string;
  endadornment?: React.ReactNode;
  startadornment?: React.ReactNode;
  hiddenLabel?: boolean;
}

const InputWrapper = styled("div")(() => ({
  textAlign: "left",
}));

export type CustomTextFieldProps = Modify<inputProps, TextFieldProps>;

export const CustomInput = styled((props: CustomTextFieldProps) => (
  <TextField
    InputProps={
      {
        disableUnderline: true,
        endAdornment: props.endadornment,
        startAdornment: props.startadornment,
      } as Partial<OutlinedInputProps>
    }
    sx={{
      // border: props.error ? '2px solid #A73636' : '',
      borderRadius: "0.5rem",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    backgroundColor: "#fff !important",
    fontSize: "1rem",
    overflow: "hidden",
    width: "100%",
    fontWeight: "700",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    textAlign: "left",
    border: "1px solid #E4E6E8",
    borderRadius: "0.5rem",
    "&:hover": {
      backgroundColor: "#fff",
    },
    "&.Mui-focused": {
      borderRadius: "0.5rem",
      border: "2px solid #E77A0C",
      backgroundColor: "#fff",
    },
    "textarea:focus": {
      boxShadow: "none",
      border: "none",
    },
    "&.Mui-disabled": {
      color: "#000000 !important",
    },
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#8083A3",
    color: " #8083A3",
    backgroundColor: "#F5F5FA",
  },
  "& .MuiFilledInput-root.Mui-error": {
    border: "2px solid #A73636",
  },
  "&.MuiFormLabel-root MuiInputLabel-root.Mui-error": {
    color: "rgba(0, 0, 0, 0.6) !important",
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
}));

const Input = (props: inputProps) => {
  let error = false;
  let touched = false;

  if (props.error && props.error[props.name]) {
    error = true;
  }

  if (props.touched && props.touched[props.name]) {
    touched = true;
  }

  return (
    <InputWrapper sx={props.sx}>
      <CustomInput
        id={props.id}
        sx={props.sx}
        hiddenLabel={props.hiddenLabel}
        margin={props.margin ? props.margin : "none"}
        required={props.required}
        fullWidth={props.fullWidth ? props.fullWidth : true}
        autoFocus={props.autoFocus}
        type={props.type}
        name={props.name}
        variant="filled"
        multiline={props.multiline}
        rows={props.rows}
        maxRows={props.maxRows}
        label={props.label}
        value={props.value}
        placeholder={props.placeholder}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyUp={props.onKeyUp}
        error={error && touched}
        readOnly={props.readOnly}
        classes={props.classes}
        className={props.className}
        aria-label={props.ariaLabel}
        data-testid={props.dataTestId}
        disabled={props.disabled}
        endadornment={props.endadornment}
        startadornment={props.startadornment}
      />
      {props.error && props.error[props.name] && touched && <Typography sx={{ color: "#A73636" }}>{props.error[props.name]}</Typography>}
    </InputWrapper>
  );
};

export default Input;
