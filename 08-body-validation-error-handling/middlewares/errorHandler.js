const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(error);
  }
  res.status(error.cause || 500).json({ msg: error.message });
};

export default errorHandler;
