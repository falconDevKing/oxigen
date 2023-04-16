import toast from "react-hot-toast";

const SuccessHandler = (msg?: { message: string; details?: string }) => {
  if (msg) {
    toast.success(msg.message);
    if (msg.details) return toast.success(msg.details);
  } else {
    return toast.success("Successful");
  }
};

export default SuccessHandler;
