export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};

export const isBadRequestError = (error) => {
  return error?.response?.status === 400;
};

export const isUnauthorizedError = (error) => {
  return error?.response?.status === 401;
};

export const isForbiddenError = (error) => {
  return error?.response?.status === 403;
};

export const isServerError = (error) => {
  return error?.response?.status === 500;
};

export const getErrorStatus = (error) => {
  return error?.response?.status;
};
