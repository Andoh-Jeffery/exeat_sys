const express = require('express')
const session = require('express-session')
const path=require('path')
const FireStoreStore = require("firestore-store")(session)
const bcrypt = require('bcrypt')
require('dotenv').config()
const db = require('./config/db')
const student = require('./routes/student')
const teacher = require('./routes/teacher')
const firestoreStore = require('firestore-store')
const { log } = require('console')
const app = express()

const store = new FireStoreStore({
    database: db,
    collection: "session",
})
app.use(
    session({
        secret: "the key for the secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"./public")))
app.use('/student', student)
app.use('/teacher', teacher)

// SESSION


// MIDDLEWARE
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    }
    else{
        // res.redirect('/login')
    }
}

const isAuthorize=(req,res,next)=>{
    if(req.session.isAuthorize==="1"){
        console.log("this is for house one");
        next()
    }else if(req.session.isAuthorize==="2"){
        console.log("this is for house two");
        next()
    }else{console.log("not Authorize");}
}

// GET REQUEST TO /
app.get('/', (req, res) => {
    res.render('login')
    // res.send('homepage')
})
// 
// GET REQUEST TO /DASHBOARD
app.get('/dashboard', isAuth,isAuthorize,(req, res) => {
    res.status(200).render('dashboard',{title:'dashboard'})
})
// LOGIN

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        console.log(email,password);
        const teacher = await db.collection('teacher').where('email', '==', email).get()
        if (!teacher.empty) {
            console.log("yes");
            teacher.forEach(async (teacher) => {
                const isMatch = await bcrypt.compare(password, teacher.data().password)
                if (!isMatch) {
                    // console.log("matched");
                    // console.log(teacher.data().house);
                    // console.log(tea.data().email);
                    // req.session.isAuth = true
                    // req.session.isAuthorize = teacher.data().house
                    // return res.redirect('/dashboard')
                    console.log("no match");
                }
                req.session.isAuth = true;
                req.session.isAuthorize = teacher.data().house;
                return res.redirect('/dashboard')
            })
        }
        else {
            console.log('wrong creds');
        }
    } catch (error) {
        console.log("error", error);
    }
})


app.listen(process.env.PORT, (console.log(`listening on port http://localhost:${process.env.PORT}`)))