require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const routes = require("./routes/routes");
const mongoose = require("mongoose");
const { sendError } = require("./utils/utils");
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", routes);

app.use((req, res) => {
  return sendError(res, 500, req.url + " Not Found");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("\n>> Connected to Database\n");
  })
  .catch((err) => {
    console.log("Connection Failed", err);
  });

app.listen(port, (err) => {
  if (err) {
    console.log("Server Error", err);
  } else {
    console.log(`\n>> Server is running at Port ${port}\n`);
  }
});
