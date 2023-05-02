require("dotenv").config()
const express = require("express");
const routes = require("./routes/router");
const cors = require("cors");

const app = express();

app.use(express.json(), cors(), routes);

app.listen((process.env.PORT ?? 4000), () => console.log("online in port 4000"));
