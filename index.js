const express= require("express");
const cors=require('cors');
require('./DB/Config');
require("dotenv").config();
const User= require("./DB/User");
const Product=require("./DB/Product");
const app=express();
app.use(cors());
app.use(express.json());
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const SECRET = 'umairSecret'


app.post("/register", async(req, resp)=>{
    const {name,email,password} = req.body;
    console.log("user data: ",req.body);
    const user = await User.findOne({email: email});
    if(user){
        resp.send({message: "user already exists"});
    }else{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const userData = new User({
            name: name,
            email: email,
            password: hash,
        });
        const added = await userData.save();
        if(added){
            resp.send({message: 'User registerd successfully',status: 200});
        }else{
            resp.send({message: 'User not created!'});
        }
    }
})

app.post("/login", async (req, res)=>{

    const {email, password} = req.body;

    if((email) && (password))
    {
        let user = await User.findOne({email: email});

        if(user){
            if(bcrypt.compareSync(password, user.password)){
                const userData = {
                    name: user.name,
                    email: user.email,
                }
                var token = jwt.sign(userData,SECRET, {
                    expiresIn: '1h'
                });
                const payload = {
                    userData,
                    token
                }
                console.log("payload: ",payload);
                res.send({data: payload,status: 200});
            }else{
                res.send({message: 'Invalid password'})
            }
        }
        else{
            res.send({message: "Error... "});
        }
    }
    
    
})

app.post("/add-product", async(req, resp)=>{
    let product =new Product(req.body);
    let result= await product.save();
    resp.send(result);
})

app.get("/products", async (req, resp) => {
    let products= await Product.find();
    if(products.length >0)
    {
        resp.send(products);
    }
    else{
        resp.send({result: "No Product Found"});
    }
})

app.delete("/delete/:id", async(req, resp)=>{
    const result= await Product.deleteOne({_id: req.params.id});
    resp.send(result);
});

app.get("/get-details/:id", async(req, resp)=>{
    let result = await Product.findOne({_id: req.params.id});
    if(result)
    {
        resp.send(result);
    }
    else{
        resp.send({result:"No record found"});
    }
})

app.put("/update-product/:id", async(req, resp)=>{
    let result = await Product.updateOne(
           {_id: req.params.id}, {$set: req.body}

    )
    resp.send(result);
})

app.listen(process.env.PORT || 5000);