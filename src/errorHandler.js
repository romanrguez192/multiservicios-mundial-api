// Error handler provicional
const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.type == "not-found") {
    return res.status(404).json({ message: err.message });
  }
  if (
    err.code &&
    (err.code.slice(0, 2) == "22" || err.code.slice(0, 2) == "23")
  ) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err });
};

module.exports = errorHandler;