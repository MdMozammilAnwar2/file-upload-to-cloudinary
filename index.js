const express=require("express");
require("dotenv").config();
const app=express();
const fileUpload=require('express-fileupload');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name:"dtaw2lqon",
    api_key:"431283158756173",
    api_secret:"FlUYuKsqh2wt1_SBTpYCZnjpJsM"
});


const { PORT }= process.env;
// mention the templeting engine
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload({useTempFiles:true,tempFileDir:"/temp"}));

app.get("/myGet",(req,res)=>{
    console.log(req.body);
    //res.send({data:req.body});
    res.send(req.query);
});
app.post("/myPost",async (req,res)=>{
    console.log(req.body);
    console.log(req.files);
    let result;
    let imageArray=[];

    if(req.files){
        for (let index = 0; index < req.files.ProfilePic.length; index++) {
            let result= await cloudinary.uploader.upload(req.files.ProfilePic[index].tempFilePath,
                {
                    folder:"users"
                }
            );
            imageArray.push({
                public_id:result.public_id,
                secure_url:result.secure_url
            });
        }
    }

    //let file =req.files.ProfilePic
    // result =await cloudinary.uploader.upload(file.tempFilePath,{
    //     folder:"users"
    // });
    console.log(result);
    details={
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        result,
        imageArray
    }
    res.send(details);
})
app.get("/myGetForm",(req,res)=>{
    res.render("getForm");
})
app.get("/myPostForm",(req,res)=>{
    res.render("postForm");
})
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})