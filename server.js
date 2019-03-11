const express = require("express");
const esm = require("esm-middleware");
const http = require("http");
const path = require("path");
 
const app = express();
 
// The esm middleware should be attached to the Express app before
// the static built-in middleware.
app.use(esm({cache:false}));
 
// Make the node_modules directory public.
app.use("/node_modules", express.static("node_modules"));
 
// Also, expose the directory where our client side code lives.
app.use("/src", express.static("src", { maxAge: 0 }));
 
const server = http.createServer(app);
 
server.listen(8080, () => console.log("Listening on port 8080"));