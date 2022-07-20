/** BizTime express application. */


const express = require("express");
const app = express();
const expressRoutes = require('./routes/companies')
const ExpressError = require("./expressError")

app.use(express.json());

app.use('/companies', expressRoutes);


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  let status = err.status || 500;

  return res.status(status).json({
    error: err,
    message: err.message
  });
});


module.exports = app;
