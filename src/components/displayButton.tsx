import Button from "@mui/material/Button";

type displayButtonProps = {
  title: string;
  setText: string;
  setDisplay: (text: string) => void;
};

const DisplayButton = ({ title, setText, setDisplay }: displayButtonProps) => {
  return (
    <Button
      variant="contained"
      onClick={() => setDisplay(setText)}
      sx={{
        borderRadius: "0 32px 0 32px",
        background: "#262555",
        color: "white",
        "&:hover": {
          background: "#6BE5B4",
        },
      }}
    >
      {title}
    </Button>
  );
};

export default DisplayButton;
