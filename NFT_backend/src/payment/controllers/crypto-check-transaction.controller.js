const cryptoCheckTransaction = (req, res, next) => {
  try {
    console.log(req);
  } catch (error) {
    next(error);
  }
};
