const express = require("express");
const app = express();
const port = 3000;
// const bodyParser = require("body-parser");
// // const cors = require("cors");
// const morgan = require("morgan");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const mongoose = require("mongoose");
// require("dotenv").config();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
