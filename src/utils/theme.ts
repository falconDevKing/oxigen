import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#E77A0C",
      light: "#FBA34B",
      contrastText: "#3D1E01",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    secondary: {
      main: "#F5F5FA",
      contrastText: "#8083A3",
    },
    blue: {
      main: "#3E7EFF",
      contrastText: "#3E7EFF",
    },
    error: {
      dark: "#D14343",
      main: "#F4B6B6",
      light: "#FDF4F4",
      contrastText: "#A73636",
    },
    warning: {
      dark: "#E77A0C",
      main: "#FFFAF1",
      light: "#FDD6AF",
      contrastText: "#996A13",
    },
    info: {
      dark: "#3366FF",
      main: "#D6E0FF",
      light: "#FDF4F4",
      contrastText: "#2952CC",
    },
    success: {
      dark: "#42975E",
      main: "#DCF2E3",
      light: "#F5FBF7",
      contrastText: "#42975E",
    },
  },

  typography: {
    allVariants: {
      fontFamily: "'Helvetica', sans-serif",
      textTransform: "none",
    },
    button: {
      textTransform: "none",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
    blue: Palette["primary"];
  }
  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
    blue: PaletteOptions["primary"];
  }
}

export default Theme;
