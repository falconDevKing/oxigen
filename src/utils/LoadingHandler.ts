import toast from "react-hot-toast";

const LoadingHandler = (msg?: { message: string; details?: string }) => {
  if (msg) {
    toast.loading(msg.message, { duration: 5000 });
    if (msg.details) return toast.loading(msg.details);
  } else {
    return toast.loading("Processing");
  }
};

export const DismissHandler = () => {
  toast.dismiss();
};

export default LoadingHandler;
