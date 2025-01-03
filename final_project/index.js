const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
 // Verify if there is an authorization in this session
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Obtaining the token
        
        // Validating the token JWT
        jwt.verify(token, "fingerprint_customer", (err, decoded) => {
            if (err){
                return res.status(403).json({message: "User not authenticated"}) // Invalid Token
            }
            req.user = decoded; // Data od the user
            next(); // Going to the next midlware or endpoint
        });
    
    } else{
        return res.status(403).json({message: "User not logged in" }); // The user don't have authorization
    }
});

 
const PORT =5500;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
