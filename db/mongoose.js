const mongoose = require('mongoose')
require('dotenv/config')
require('dotenv').config()

const url = process.env.MONGODB_URL;
mongoose.connect(url , {
}).then(() => {
    console.log('connected to databse');
}).catch((e) =>{
    console.log(e);
})