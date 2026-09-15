const registerUser = async (req, res) => {
   const { username, email, password } = req.body;
   console.log(username, email, password)
   res.json({
      username,
      email,
      password
   })
}


export { registerUser }