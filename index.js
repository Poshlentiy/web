require("dotenv").config();
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
const path = require("path");
const fs = require("fs");
const router = require("./routes/index");

//hjhjhвdsf

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(/*{ force: true }*/);
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

async function fileOrder(request) {
  console.log(request);
  for (let i in request) {
    if (request[i] == "") {
      request[i] = "none";
    }
    console.log(request[i]);
    fs.appendFileSync("info.txt", `${i}: ${request[i]}\n`, () => {});
  }
}

const multer = require("multer");
let fName;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    fName = file.fieldname + "-" + uniqueSuffix + ".bmp";
    cb(null, fName);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/bmp") cb(null, true);
    else {
      cb(null, false);
      console.log(new Error("Only .bmp format allowed!"));
    }
  },
}).any("image");

app.use(express.json());
app.use(express.urlencoded());
app.use(require("body-parser").json());
app.use(express.static("public"));
app.use(express.static("public/Images"));
app.use(cors());
app.use("/api", router);

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/gym.html");
});

let reqData = {
  //fName: fName,
};

app.post("/deleteuser", async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  await models.User.destroy({ where: { id: id } });
  res.sendStatus(200);
});
let SearchUser = {};
app.post("/updateuser", async (req, res) => {
  
  console.log(req.body);
  const id = req.body.id;
  console.log(id);
  SearchUser = await models.User.findByPk(id);
  console.log(SearchUser);
  res.sendStatus(200);
  //res.send(SearchUser);
});
let SearchedUser = {};
app.get("/updateuser1", async (req, res) => {
  
  res.send(SearchUser);
  SearchedUser = SearchUser
  SearchUser = null;
});

app.post("/updateuser2", async (req, res) => {
  models.User.update(req.body, {where:{ email: req.body.email}})
  res.sendFile(__dirname + "/public/users.html");
});

app.get("/data", (req, res) => {
  res.send(reqData);
});
app.get("/users", async (req, res) => {
  // await models.User.destroy({ where: { id: 1 } });
  res.sendFile("public/users.html", { root: __dirname });
  // res.send(Searchall);
});
app.get("/usersList", async (req, res) => {
  const Searchall = await models.User.findAll();
  res.send(Searchall);
});
app.get("/download", (req, res) => {
  res.download("info.txt");
});
app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send(err);
    } else if (err) {
      res.send(err);
    }
    console.log("Image Uploaded");
    res.sendStatus(200);
  });
});
app.post("/form", async (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/public/test.html");
  reqData = req.body;
  fs.unlinkSync("info.txt");
  fs.appendFileSync("info.txt", `You are registred succesfully!\n\n`, () => {});
  fileOrder(reqData);
  await models.User.create(reqData);
  const Searchall = await models.User.findAll();
  console.log(Searchall);
});
