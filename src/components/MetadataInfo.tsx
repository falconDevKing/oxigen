import React, { ReactElement } from "react";
import UIModal from "./Modal";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import Button from "@mui/material/Button";

interface SectionProps {
  children: ReactElement | ReactElement[];
}
interface SectionTitleProp {
  icon: React.ReactElement;
  title: string;
  hideButton?: boolean;
  handleChange?: (event: React.SyntheticEvent, newValue: number) => void;
}

interface MiniDetailsProps {
  name: string;
  value: string;
}

const Section = ({ children }: SectionProps) => <Box pb={{ xs: "0rem", sm: "3rem", md: "3rem" }}> {children}</Box>;

const SectionContent = ({ children }: SectionProps) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
      padding: "16px 0px",
      position: "relative",
      top: {
        xs: "-30px",
        sm: "0px",
        md: "0px",
      },
    }}
  >
    {children}
  </Box>
);

const SectionTitle = ({ icon, title, hideButton = true, handleChange }: SectionTitleProp) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0px",
          position: "relative",
          top: {
            xs: "-20px",
            sm: "0px",
            md: "0px",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", padding: "8px 0px" }}>
          <Box
            bgcolor={"#FDEDDD"}
            borderRadius="50%"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              width: {
                xs: "32px",
                sm: "40px",
                md: "40px",
              },
              height: {
                xs: "32px",
                sm: "40px",
                md: "40px",
              },
            }}
          >
            {icon}
          </Box>
          <Box fontWeight="700" lineHeight="1.5rem" fontSize={{ xs: "16px", sm: "1.25rem", md: "1.25rem" }} px="0.5rem">
            {title}
          </Box>
        </Box>
        {!hideButton && (
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              sx={{
                color: "#3D1E01",
                boxShadow: "none",
                textTransform: "none",
                fontSize: "0.875rem",
                padding: "12px 30px",
                fontWeight: "400",
                borderRadius: "10px",
                marginRight: "1rem",
                border: "1px solid #BBBEC2",
                "&:hover": {
                  background: "#F5F5FA",
                  boxShadow: "none",
                },
              }}
              onClick={(e) => {
                handleChange && handleChange(e, 2);
              }}
            >
              How to Pay
            </Button>{" "}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const MiniDetails = ({ name, value }: MiniDetailsProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="start"
      fontWeight="500"
      lineHeight="1.3125rem"
      width="100%"
      py="4px"
      fontSize={{ xs: "13px", sm: "16px", md: "16px" }}
    >
      <Box textAlign="left" color="secondary.contrastText" flexBasis={{ xs: "55%", sm: "36%", md: "36%" }}>
        {name}
      </Box>
      <Box
        textAlign="right"
        color={{ xs: "#171721", sm: "primary.light", md: "primary.light" }}
        fontWeight={{ xs: 600, sm: 400, md: 400 }}
        flexBasis="63%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box>{value}</Box>
      </Box>
    </Box>
  );
};

interface MetadataInfoProps {
  openModal: boolean;
  modalCloser: () => void;
  modalData: any[];
}

const MetadataInfo = ({ openModal, modalCloser, modalData }: MetadataInfoProps) => {
  return (
    <UIModal maxWidth="sm" bgPrimary={true} title={"Extra Information"} open={openModal} showShareIcon={false} handleClose={modalCloser}>
      <Section>
        <SectionTitle icon={<InfoIcon color="inherit" />} title="Extra Information" />
        <SectionContent>
          {modalData.map((data, index) => (
            <MiniDetails key={index} name={data[1]} value={data[2]} />
          ))}
        </SectionContent>
      </Section>
    </UIModal>
  );
};

export default MetadataInfo;
