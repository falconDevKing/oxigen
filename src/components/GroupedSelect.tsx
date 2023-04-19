import React from "react";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import { InputBase, ListSubheader, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Modify } from "utils/modify";

interface SingleSelectProps {
  onChange?: (event: SelectChangeEvent<string>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  setFieldTouched?: (field: string, value: boolean) => void;
  value: string | undefined;
  groups: {
    value: string;
    name: string;
    options: { value: string; name: string }[];
  }[];
  placeholder?: string;
  title?: string | React.ReactElement;
  name: string;
  className?: string;
  fieldValue?: string;
  error?: {
    [key: string]: any;
  };
  labelId: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  touched?: {
    [key: string]: any;
  };
  variant?: "outlined" | "standard" | "filled";
  sx?: { [key: string]: string | number };
  hiddenLabel?: boolean;
  icon?: React.ElementType<any>;
}
const SelectWrapper = styled(FormControl)(() => ({
  width: "100%",
  textAlign: "left",
  marginBottom: "0.5rem",
  marginTop: "1rem",
}));
const CustomLabel = styled(InputLabel)(() => ({
  position: "absolute",
  marginTop: "0.35rem",

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
      borderColor: theme.palette.primary.main,
      padding: "1.8rem 0 0.2625rem 0.7rem",
    },
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

const renderSelectGroup = (group: { value: string; name: string; options: { value: string; name: string }[] }) => {
  const items = group.options.map((option) => {
    return (
      <MenuItem
        sx={{
          color: "#171721",
          fontSize: "0.75rem",
          lineHeight: "1rem",
          fontWeight: 400,
          marginLeft: "1.25rem",
        }}
        key={option.value}
        value={option.value}
      >
        {option.name}
      </MenuItem>
    );
  });
  return [
    <ListSubheader
      key={group.value}
      sx={{
        color: "#8083A3",
        fontSize: "0.75rem",
        lineHeight: "1.25rem",
        fontWeight: 600,
      }}
    >
      {group.name}
    </ListSubheader>,
    items,
  ];
};

type IGroupedSelectInterface = Modify<SelectProps, SingleSelectProps>;

const GroupedSelectInput = ({
  onChange,
  onBlur,
  groups,
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
  touched,
  setFieldTouched,
  hiddenLabel,
  icon: Icon,
}: IGroupedSelectInterface) => {
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
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        onClose={handOnClose}
        input={hiddenLabel ? <NoLabelCustomInput required={required} id={id} /> : <CustomInput required={required} id={id} />}
        sx={{
          width: "100%",
        }}
        label={!hiddenLabel && title}
        error={isError && isTouched}
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
      >
        {groups.map((group) => renderSelectGroup(group))}
      </Select>
      {!value && error && error[name] && touched && touched[name] && <Typography sx={{ color: "#A73636" }}>{error[name]}</Typography>}
    </SelectWrapper>
  );
};

export default GroupedSelectInput;
