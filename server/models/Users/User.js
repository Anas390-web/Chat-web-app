import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'Please provide username'],
      unique: true,
      maxlength: 50,
      minlength: 3
   },
   email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Please provide the valid email'
      ],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [3, 'Please write atleast 3 letters'],
      maxlength: 50
   },
   userAvatarUrl: {
      type: String,
      default: null
   }
})

// HASHING PASSWORD BEFORE SAVING TO THE DB:
UserSchema.pre('save', async function () {
   // IF PASSWORD IS NOT MODIFIED/CHANGED
   if (!this.isModified('password')) {
      return;
   }
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(this.password, salt)
   this.password = hashPassword;
})

// ATTACHING JWT CREATION FUNCTION TO SCHEMA METHODS:
UserSchema.methods.createJwt = function () {
   return jwt.sign({
      username: this.username,
      userId: this._id
   }, process.env.JWT_SECRET_KEY,
      {
         algorithm: 'HS256',
         expiresIn: '7d'
      })
}

// ATTACHING COMPARE PASSWORD FROM LOGIN TO SCHEMA METHODS:
UserSchema.methods.comparePassword = async function (userPassword) {
   const isMatched =  await bcrypt.compare(userPassword, this.password);
   return isMatched;
}


const User = mongoose.model('User', UserSchema)

export default User