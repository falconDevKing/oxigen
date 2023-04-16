import React, { ReactElement } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { InputBase, SxProps, Typography } from "@mui/material";

interface SingleSelectProps {
  name: string;
  value: string | undefined;
  options: { value: string; name: string }[];
  labelId: string;
  onChange?: (event: SelectChangeEvent<string>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  setFieldTouched?: (field: string, value: boolean) => void;
  placeholder?: string;
  title?: string | React.ReactElement;
  IconDropdown?: React.FC;
  dataTestid?: string;
  icon?: React.ElementType<any>;
  className?: string;
  error?: {
    [key: string]: any;
  };
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  touched?: {
    [key: string]: any;
  };
  variant?: "outlined" | "standard" | "filled";
  sx?: SxProps;
  hiddenLabel?: boolean;
}

const SelectWrapper = styled(FormControl)(() => ({
  width: "100%",
  textAlign: "left",
  marginBottom: "0.5rem",
  marginTop: "1rem",
}));

const CustomLabel = styled(InputLabel)(() => ({
  position: "absolute",
  marginTop: "0.1rem",
  color: "#8083A3",
  fontWeight: "600",
  "&.Mui-focused, input:focus": {
    marginTop: "1.2rem",
  },
  "&.MuiFormLabel-filled": {
    marginTop: "1.2rem",
    fontFamily: "SF Pro Display Medium",
  },
}));

const CustomInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    fontSize: "1rem",
    width: "100%",
    padding: "1.8rem 0 0.2625rem 0.7rem",
    fontWeight: "700",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    textAlign: "left",
    border: "1px solid #E4E6E8",
    borderRadius: "0.5rem",
    "&:focus": {
      borderRadius: "0.5rem",
      border: `2px solid  ${theme.palette.primary.main}`,
      padding: "1.8rem 0 0.2625rem 0.7rem",
    },
    "&.Mui-disabled": {
      WebkitTextFillColor: "#8083A3",
      color: " #8083A3",
      backgroundColor: "#F5F5FA",
    },
    "&.Mui-error": {
      border: "2px solid #A73636",
      color: "rgba(0, 0, 0, 0.6) !important",
    },
  },
  "&.MuiFormLabel-root MuiInputLabel-root.Mui-error": {
    color: "rgba(0, 0, 0, 0.6) !important",
  },
  label: {
    color: "#8083A3",
    fontFamily: "SF Pro Display Medium",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    marginTop: "2px",
    border: "none !important",
  },
  placeholder: {
    color: "#8083A3",
    fontFamily: "SF Pro Display Medium",
    lineHeight: "18px",
  },
}));

const NoLabelCustomInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    fontSize: "1rem",
    width: "100%",
    padding: "0.5rem",
    fontWeight: "700",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    textAlign: "left",
    border: "1px solid #E4E6E8",
    borderRadius: "0.5rem",
    "&:focus": {
      borderRadius: "0.5rem",
      borderColor: theme.palette.primary.main,
      padding: "0.5rem",
    },
  },
}));

const SelectInput = ({
  onChange,
  onBlur,
  options,
  title,
  value,
  name,
  required,
  disabled,
  readonly,
  error,
  placeholder,
  labelId,
  id,
  className,
  variant,
  sx,
  hiddenLabel,
  icon: Icon,
  touched,
  setFieldTouched,
}: SingleSelectProps) => {
  const theme = useTheme();

  let isError = false;
  let isTouched = false;

  if (error && error[name]) {
    isError = true;
  }

  if (touched && touched[name]) {
    isTouched = true;
  }

  const handOnClose = () => {
    setFieldTouched ? setTimeout(() => setFieldTouched(name, true)) : null;
  };

  return (
    <SelectWrapper className={className} variant={variant ? "standard" : "outlined"} sx={sx}>
      {!hiddenLabel && (
        <CustomLabel required={required} id={labelId}>
          {title}
        </CustomLabel>
      )}
      <Select
        labelId={labelId}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        onClose={handOnClose}
        onBlur={onBlur}
        IconComponent={
          Icon
            ? (props) => (
                <Icon
                  {...props}
                  sx={{
                    color: "#8083A3 !important",
                    margin: "0 5px 0 0",
                  }}
                />
              )
            : undefined
        }
        input={hiddenLabel ? <NoLabelCustomInput required={required} id={id} /> : <CustomInput required={required} id={id} />}
        sx={{
          width: "100%",
          border: !value && isError && isTouched ? "2px solid #A73636" : "",
          borderRadius: "0.5rem",
        }}
        label={!hiddenLabel && title}
        error={isError && isTouched}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {!value && error && error[name] && touched && touched[name] && <Typography sx={{ color: "#A73636", mt: 1 }}>{error[name]}</Typography>}
    </SelectWrapper>
  );
};

export default SelectInput;
