// import Box from "@mui/material/Box";
// import { styled } from "@mui/material/styles";
// import React, { PropsWithChildren, ReactNode } from "react";
// import CloseIcon from "@mui/icons-material/Close";
// import ShareIcon from "@mui/icons-material/Share";
// import IconButton from "@mui/material/IconButton";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Dialog, { DialogProps } from "@mui/material/Dialog";
// import { useMediaQuery } from "@mui/material";

// type UIModalProps = PropsWithChildren<{
//   open: boolean;
//   bgPrimary?: boolean;
//   showClose?: boolean;
//   showShareIcon?: boolean;
//   handleClose: () => void;
//   title?: string | ReactNode;
//   altTitle?: string | ReactNode;
//   maxWidth?: DialogProps["maxWidth"];
// }>;

// type DialogTitleProps = PropsWithChildren<{
//   id?: string;
//   showShareIcon?: boolean;
//   onClose?: () => void;
//   altTitle?: string | ReactNode;
// }>;

// const StyledDialog = styled(Dialog)(() => ({
//   "&": {
//     ".MuiDialog-scrollPaper": {
//       alignItems: "baseline",
//     },

//     ".MuiDialog-paperScrollPaper": {
//       top: "10%",
//       borderRadius: "8px",
//       boxShadow: "0px 3px 4px rgba(153, 155, 168, 0.25)",
//       margin: "0px",
//       padding: "0px",
//     },
//   },
// }));

// const DialogTitleComponent = (props: DialogTitleProps) => {
//   const { children, altTitle, showShareIcon, onClose, ...other } = props;

//   return (
//     <DialogTitle
//       sx={
//         altTitle
//           ? null
//           : {
//               m: 0,
//               padding: {
//                 xs: "2rem 1rem 0.8rem",
//                 sm: "2rem 2.5rem 1rem",
//                 md: "2rem 2.5rem 1rem",
//               },
//               fontSize: {
//                 xs: "18px",
//                 sm: "1.5rem",
//                 md: "1.5rem",
//               },
//               fontFamily: "SF Pro Display Medium",
//               fontWeight: 600,
//               textAlign: "left",
//               color: {
//                 xs: "#171721",
//                 sm: "#171721",
//                 md: "#171721",
//               },
//               backgroundColor: "#fff",
//               borderBottom: "0px",
//               lineHeight: {
//                 xs: "18px",
//                 sm: "2rem",
//                 md: "2rem",
//               },
//             }
//       }
//       {...other}
//     >
//       {children}
//       {onClose && !showShareIcon ? (
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             top: {
//               xs: "20px",
//               sm: "20px",
//               md: 8,
//             },
//             right: 8,
//             position: "absolute",
//             backgroundColor: "#F5F5FA",
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}

//       {showShareIcon ? (
//         <IconButton
//           aria-label="close"
//           sx={{
//             top: "20px",
//             right: "1rem",
//             position: "absolute",
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <ShareIcon />
//         </IconButton>
//       ) : (
//         <></>
//       )}
//     </DialogTitle>
//   );
// };

// const UIModal = ({ open, title, children, altTitle, showShareIcon, showClose, handleClose, maxWidth = "lg", bgPrimary = true }: UIModalProps) => {
//   const matches = useMediaQuery("(min-width:900px)");
//   // const currentLocation = useLocation();

//   return (
//     <div>
//       <StyledDialog
//         fullWidth
//         open={open}
//         maxWidth={maxWidth}
//         onClose={handleClose}
//         aria-labelledby="dialog-title"
//         // PaperProps={{
//         //   sx: {
//         //     width: {
//         //       xs: currentLocation.pathname == "/recipients" ? "80%" : "90%",
//         //       sm: "60%",
//         //     },
//         //     maxWidth: currentLocation.pathname == "/recipients" ? "22rem" : "maxWidth",
//         //   },
//         // }}
//         sx={{
//           maxHeight: "85vh",
//         }}
//       >
//         {(title || altTitle) && (
//           <DialogTitleComponent altTitle={altTitle} onClose={handleClose} showShareIcon={!!(showShareIcon && !matches)}>
//             {altTitle ?? title}
//           </DialogTitleComponent>
//         )}
//         {showClose && <DialogTitleComponent onClose={handleClose} showShareIcon={showShareIcon && !matches ? true : false} />}
//         <DialogContent
//           sx={{
//             padding: {
//               xs: "0px 0px 0px 0px",
//             },
//           }}
//         >
//           <Box
//             sx={{
//               padding: {
//                 xs: "30px 20px 20px 20px",
//                 sm: "30px 40px 20px 40px",
//                 md: "30px 40px 20px 40px",
//               },
//             }}
//           >
//             {children}
//           </Box>
//         </DialogContent>
//       </StyledDialog>
//     </div>
//   );
// };

// export default UIModal;
