import toast from "react-hot-toast";

const Message = {
  ErrorResponseUndefined: "An error occurred",
  UserNotConfirmedException: "UserNotConfirmedException",
  EmailVerificationError: "An error occurred while verifying email",
};

const ErrorHandler = (error?: {
  message?: string;
  details?: string;
  custom?: boolean;
}) => {
  if (error) {
    if (error.message)
      return toast.error(error.message, {
        style: {
          background: "Red",
          color: "#fff",
        },
      });
    if (error.custom) return toast.error(Message.ErrorResponseUndefined);
    if (error.details) return toast.error(error.details);
  } else {
    return toast.error(Message.ErrorResponseUndefined);
  }
};

export default ErrorHandler;
