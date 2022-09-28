const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    middle_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone:{
        type: Number,
        unique:true,
        required:true
        // required:true,
        // validate(value){
        //     if(!validator.isPhoneNumber(value)){
        //         throw new Error('Phone number is invalid')
        //     }
        // }
    },
    password:{
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot be "password"')
            }
        }
    },
    country:{
        type: String,
        required:true,
        trim:true
    },
    role: {
        type: String,
        enum: ['user','agent', 'admin'],
        default: 'user',
    },
    hash : String,
    salt : String,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    
},{
    timestamps: true
})

userSchema.methods.AuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}




userSchema.methods.setPassword = function(password) {
     
       this.salt = crypto.randomBytes(16).toString('hex');
       this.hash = crypto.pbkdf2Sync(password, this.salt, 
       1000, 64, `sha512`).toString(`hex`);
   };

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

userSchema.statics.findByCredentials = async (email, password,role) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Wrong email or password')
    }
    if(role!=user.role){
        throw new Error('Wrong credentials')
    }

    if (!user.validPassword(password)) {
        return res.status(400).send({
            message : "Wrong Password"
        });
    }
    
    return user
}


const User = mongoose.model('Users', userSchema)

module.exports = User