const express= require("express");
const cors=require('cors');
require('./DB/Config');
require("dotenv").config();
const User= require("./DB/User");
const Product=require("./DB/Product");
const app=express();
app.use(cors());
app.use(express.json());


app.post("/register", async(req, resp)=>{
    let user =new User(req.body);
    let result= await user.save();
    resp.send(result);
})

app.post("/login", async (req, res)=>{

    if((req.body.email) && (req.body.password))
    {
        let user =await User.find(req.body);
        if(user){
            res.send(user);
        }
        else{
            res.send({result: "Error... "});
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

app.get("/delete/:id", async(req, resp)=>{
    let result = await Product.findOne({_id: req.params.id});
    if(result)
    {
        resp.send(result);
    }
    else{
        resp.send({result:"No record found"});
    }
})

app.put("/delete/:id", async(req, resp)=>{
    let result = await Product.updateOne(
           {_id: req.params.id}, {$set: req.body}

    )
    resp.send(result);
})

app.listen(5000);