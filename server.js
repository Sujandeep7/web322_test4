const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const app = express();
const exphbs = require("express-handlebars");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "fdfeigut",
  "fdfeigut",
  "SiKSQ_y4GHa1Wqng39CYsxjiJ0a85BhC",
  {
    host: "isilo.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

let users = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: Sequelize.DATE,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);


app.use(express.static("./public/"));


const hbs = exphbs.create({
  helpers: {
    formatDate: function (date) {
      return date.toLocaleDateString();
    },
  },

  extname: ".hbs",
});


app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


app.use(bodyParser.urlencoded({ extended: false }));


app.get("/update-user", (req, res) => {
  const id = req.query.id;
  users
    .findAll({
      where: {
        id: id,
      },
    })
    .then(function (results) {
      res.render("edit", { users: results[0], layout: false });
    });
});


app.post("/update-user", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const email = req.body.email;

  sequelize.sync().then(function () {
    users
      .update(
        {
          name: name,
          email: email,
        },
        {
          where: { id: id },
        }
      )
      .then(function () {
        res.redirect("/");
      });
  });
});


app.get("/delete-user", (req, res) => {
  const id = req.query.id;

  sequelize.sync().then(function () {
    users
      .destroy({
        where: { id: id },
      })
      .then(function () {
        res.redirect("/");
      });
  });
});


app.post("/insert-user", (req, res) => {
  const { name, email } = req.body;

  users
    .create({
      name: name,
      email: email,
    })
    .then(function () {
      console.log("User created");

      res.redirect("/");
    });
});

app.get("/", (req, res) => {
  sequelize.sync().then(function () {
    users
      .findAll({})
      .then(function (results) {
        res.render("index", { users: results, layout: false });
      });
  });
});


app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});