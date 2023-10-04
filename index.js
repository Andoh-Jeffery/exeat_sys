const express = require("express");
const session = require("express-session");
const path = require("path");
const FireStoreStore = require("firestore-store")(session);
const bcrypt = require("bcrypt");
const flash = require("express-flash-2");
require("dotenv").config();
const { db } = require("./config/db");
const { isAuth, isAuthorize } = require("./config/middlewares");
const student = require("./routes/student");
const teacher = require("./routes/teacher");
const firestoreStore = require("firestore-store");
const { log } = require("console");
const app = express();

const store = new FireStoreStore({
  database: db,
  collection: "session",
});
app.use(
  session({
    secret: "the key for the secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.use("/student", student);
app.use("/teacher", teacher);

// SESSION

// MIDDLEWARE

// Middleware to handle errors
app.use((err, req, res, next) => {
  // Handle specific error types and render the login page with error messages
  if (err.name === "ValidationError") {
    res.render("login", { error: err.message });
  } else {
    // Handle other types of errors (e.g., database errors)
    // You can log the error for debugging and render an error page
    console.error(err);
    res.status(500).render("error", { error: "Internal Server Error" });
  }
});

// GET REQUEST TO /
app.get("/", (req, res) => {
  res.render("login");
});
//
// GET REQUEST TO /DASHBOARD
app.get("/dashboard", isAuth, isAuthorize, async (req, res) => {
  try {
    const teacherData = await db
      .collection("teacher")
      .where("house", "==", req.session.isAuthorize)
      .get();
    const teacherNumData = await db.collection("teacher").count().get();
    const studentsData = await db.collection("student").count().get();
    //    console.log(studentsData.data().count);
    res.status(200).render("dashboard", {
      title: "dashboard",
      auth: req.session.isAuthorize,
      data: teacherData,
      studentData: studentsData.data().count,
      teacherNumData: teacherNumData.data().count,
    });
  } catch (error) {
    console.log(error);
  }
});
// LOGIN

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(email, password);
    const teacher = await db
      .collection("teacher")
      .where("email", "==", email)
      .get();
    if (!teacher.empty) {
      console.log("yes");
      teacher.forEach(async (teacher) => {
        const isMatch = await bcrypt.compare(password, teacher.data().password);
        if (!isMatch) {
          console.log("no match");

          return res.redirect("/");
        }
        req.session.isAuth = true;
        req.session.isAuthorize = teacher.data().house;
        return res.redirect("/dashboard");
      });
    } else {
      console.log("wrong creds");
      res.redirect("/");
    }
  } catch (error) {
    console.log("error", error);
  }
});
app.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(
  process.env.PORT,
  console.log(`listening on port http://localhost:${process.env.PORT}`)
);
