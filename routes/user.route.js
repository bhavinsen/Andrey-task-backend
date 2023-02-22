module.exports = app => {
    const users = require("../controllers/user.controller");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/", users.createUser);
    router.post("/login", users.loginUser)
    router.post("/content", users.content)
    router.get("/getcontent", users.getContent)
    
  
    app.use("/api/users", router);
  };