/** main starting point of this server application  */
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");

/** express instance*/
const app = express();
/** Database setup */
/** //test basic server setup
const app2 = express();
app2.get("/", function(req, res) {
  res.send("app2");
});
http.createServer(app2).listen(3199);
 */

mongoose.connect("mongodb://localhost:27017/auth", { useNewUrlParser: true });

/** App Setup */
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

/** Server Setup */
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server listening on: ", port);
