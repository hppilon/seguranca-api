const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://injecao-sql.vercel.app",
    "https://injecao-sql-git-master-helenapilon.vercel.app",
  ],
};

const db = require("./queries");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

app.get("/user", db.getUsers);
app.get("/user/:id", db.getUserById);
app.post("/user/login", db.login);
app.post("/user", db.createUser);
app.put("/user/:id", db.updateUser);
app.delete("/user/:id", db.deleteUser);

app.get("/item", db.getItems);
app.get("/item/:id", db.getItemById);
app.post("/item", db.createItem);
app.put("/item/:id", db.updateItem);
app.delete("/item/:id", db.deleteItem);

app.get("/log", db.getLogs);
app.get("/log/:id", db.getLogById);
app.get("/log/user/:id", db.getLogByUserId);
app.post("/log", db.createLog);
app.put("/log/:id", db.updateLog);
app.delete("/log/:id", db.deleteLog);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
