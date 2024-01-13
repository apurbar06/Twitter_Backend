exports.sendError = (res, code, message, data = undefined) => {
  return res.status(code).json({
    success: false,
    message: message,
    data: data,
  });
};

exports.sendSuccess = (res, code, message, data) => {
  return res.status(code).json({
    success: true,
    message: message,
    data: data,
  });
};
