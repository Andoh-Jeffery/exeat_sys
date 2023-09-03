const firebase=require('firebase-admin')
const credentials=require('./exeat.json')

firebase.initializeApp({
    credential:firebase.credential.cert(credentials)
})

const db=firebase.firestore()
const message=firebase.messaging()

module.exports={
    db,
    message
};