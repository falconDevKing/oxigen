export const success = (statusCode: number, message = "", data: any = {}) => {
  return {
    data,
    message,
    status: statusCode,
  };
};

export const error = (statusCode: number, message = "", error: any = {}) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code === statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    error,
    message,
    status: statusCode,
  };
};

export const validation = (errors: any = []) => {
  return {
    message: "Validation errors",
    status: 422,
    errors,
  };
};
