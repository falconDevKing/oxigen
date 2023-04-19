export const getAuthTokenStorage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("AuthToken");
  }
};
