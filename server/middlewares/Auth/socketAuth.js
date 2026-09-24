import jwt from 'jsonwebtoken'

const socketAuth = (socket, next) => {
   try {
      // DE-STRUCTURE TOKEN FROM SOCKET:
      const token = socket.handshake.auth?.token; // OPTIONAL CHAINING TO PREVENT SERVER CRASH
      // IF TOKEN IS MISSING, STOP THE FUNCTION:
      if (!token) {
         console.log('Authentication token is missing');
         return next(new Error('Authentication token is missing'));
      }
      // VERIFY THE TOKEN:
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // ATTACH THE PAYLOAD TO THE SOCKET.USER PROPERTY:
      socket.user = payload;
      // PASS TO THE NEXT MIDDLEWARE:
      next();
   } catch (error) {
      console.log(error.message);
      next(new Error(error.message))
   }
}

export default socketAuth;