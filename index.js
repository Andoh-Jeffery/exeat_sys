const express=require('express')
const session=require('express-session')
const FireStoreStore=require("firestore-store")(session)
const bcrypt=require('bcrypt')
require('dotenv').config()
const db=require('./config/db')
const student=require('./routes/student')
const teacher=require('./routes/teacher')
const firestoreStore = require('firestore-store')
const app=express()

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}))
app.use('/student',student)
app.use('/teacher',teacher)
app.use(express.json())

// SESSION
const store=new FireStoreStore({
    database:db,
    collection:"session",
})
app.use(
    session({
      secret: "the key for the secret",
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );


// MIDDLEWARE
const isAuth=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }
    console.log("wrong cred");
}

// const isAuthorize=(req,res,next)=>{
//     if(req.session.isAuthorize==="1"){
//         console.log("this is for house one");
//     }else if(req.session.isAuthorize==="2"){
//         console.log("this is for house two");
//     }else{console.log("not Authorize");}
// }

// GET REQUEST TO /
app.get('/',(req,res)=>{
    res.send('homepage')
})
// 
// GET REQUEST TO /DASHBOARD
app.get('/dashboard',isAuth,isAuthorize,(req,res)=>{
    
    res.render('dashboard')
})
// LOGIN

app.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body
        const teacher = await db.collection('teacher').where('email', '==', req.body.email).get()
        
        if (!teacher.empty) {
            console.log("yes"); 
            teacher.forEach(async (teacher) => {
                const isMatch = await bcrypt.compare(req.body.password, teacher.data().password)
                if (isMatch) {
                    console.log("matched");
                    // console.log(teacher.data().house);
                        // console.log(tea.data().email);
                        req.session.isAuth=true
                        req.session.isAuthorize=teacher.data().house
                        res.render('dashboard')
                }
                else {
                    console.log("no match");
                }
            })
        }
        else {
            console.log('wrong creds');
        }
    } catch (error) {
        console.log("error", error);
    }
})


app.listen(process.env.PORT,(console.log(`listening on port http://localhost:${process.env.PORT}`)))