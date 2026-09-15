class customApiError extends Error{
   constructor(message, statusCode) {
      super(message)
      this.statusCode = statusCode
   }
}

class BadRequestError extends customApiError {
   constructor(message) {
      super(message)
      this.statusCode = 401
   }
}

class UnauthenticatedError extends customApiError {
   constructor(message) {
      super(message)
      this.statusCode = 401
   }
}

export {customApiError, BadRequestError, UnauthenticatedError}