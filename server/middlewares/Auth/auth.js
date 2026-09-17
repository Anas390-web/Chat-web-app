import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';

const userAuthentication = async (req, res, next) => {
   try {
      const authHeaders = req.headers.authorization;
      if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'Not Authorized'
         })
      }
      const token = authHeaders.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!payload) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'Not Authorized'
         })
      }
      const { username, userId } = payload;
      req.user = { username, userId };
      next();
   } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal Server Error'
      })
   }
}

export default userAuthentication;