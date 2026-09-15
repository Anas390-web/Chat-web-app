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
   }
})




const Users = mongoose.model('User', UserSchema)

export default Users