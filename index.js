import express from "express";
import{dirname} from "path"; 
import {fileURLToPath} from "url";
import mysql from "mysql2";
import { error } from "console";
import dotenv from "dotenv";
dotenv.config();
import twilio from 'twilio';
var otp;
let username_1,mobile_1,password_1;
const app = express();
const port=9000;
const __dirname=dirname(fileURLToPath(import.meta.url));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
const connection=mysql.createConnection({
    user:"root",
    host:"localhost",
    database:"FoodRestro",
    password:"Sathvik.@123"
});

// login 
app.post("/FoodRestro" ,(req,res)=>{
    let username = req.body.username;
    let password=req.body.password;
    console.log(username)
   
        
        try{
            let q=`SELECT username , password FROM login WHERE username= '${username}'`
            connection.query(q,(err,result)=>{
                if(err) throw err;
                console.log(result);
                if(result[0]){
                if(username==result[0].username){
                if((username==result[0].username) && (password==result[0].password))
                {
                res.render("index.ejs",{err:true,value:result[0].username});
                }
                else{
                    res.render("login.ejs",{value:"User Not Found!",err:true});
                }
            }
        }
            else{
                res.render("login.ejs",{value:"User Not Found!",err:true});
            }
            })
        }
             catch(err){
                console.log(err);
                res.send("catch");
            // res.render("signinemail.ejs",{error:true,content:"Account does not exist"});
             }
    });
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };
    // create accout
    app.post('/Food',(req,res)=>{
        username_1 = req.body.username;
        mobile_1 = req.body.mobile;
        password_1 = req.body.password;
        console.log(username_1,mobile_1,password_1)
        otp = generateOTP();
     // Your AccountSID and Auth Token from console.twilio.com
     const accountSid =process.env.ACCOUNTSID;
     const authToken=process.env.AUTHTOKEN;
     const client = twilio(accountSid, authToken);
     
    const sendSMS = async (body) =>{
        let msgOptions = {
             from:'',//your twillio number
             to:`+91 ${mobile_1}`,
             body
         }
         console.log(mobile_1)
    try{
        const message = await client.messages.create(msgOptions);
        console.log(message)
        // res.render("verifyNo.ejs",{data:userInput_mobNo,error:false,content:""});
        res.render("verifyNo.ejs",{mobile:mobile_1});
    }catch(err){
        console.log(err)
    }
  }
sendSMS(`${otp} One-Time-password for your Food Restro app ! Don't share with anyone`);
        // console.log(req.body.username);
        // res.send("user!")
        // try{

        // }
 })
console.log(username_1)
app.post('/newOtp',(req,res)=>{
    // let {otp_value}=req.body;
    console.log(req.body);
    if(req.body.otp_value==otp){
                try{
            let user=[username_1,mobile_1,password_1];
            let q=`insert into login values (?,?,?)`;
            connection.query(q,user,(er,result)=>{
                if (er) throw er;
                res.render("index.ejs",{err:true,value:username_1})
            })
        }
        catch(error){console.log(error);}
    }
})
    app.get('/FoodRestro',(req,res)=>{
        console.log("res recieved");
        res.render("index.ejs",{err:false,value:""});
    });
app.get("/deserts",(req,res)=>{
    console.log("deserts recieved");
    res.render("deserts.ejs");
})
app.get("/drinks",(req,res)=>{
    console.log("drinks recieved");
    res.render("drinks.ejs")
})

app.get("/food",(req,res)=>{
    console.log("food recieved");
    res.render("food.ejs");
});
app.get('/about',(req,res)=>{
    console.log("about recieved");
    res.render("about.ejs");
})
app.get('/contact',(req,res)=>{
    console.log("contact recieved");
    res.render("contact.ejs");
})
app.get('/Bag',(req,res)=>{
    console.log("Bag recieved");
    res.render("yourbag.ejs");
})
app.get('/Orders',(req,res)=>{
    console.log("order recieved");
    res.render("yourorders.ejs");
})
app.get('/login',(req,res)=>{
    res.render("login.ejs",{err:false,value:""});
})
app.get('/CreateAccount',(req,res)=>{
    res.render("CreateAccount.ejs");
})
app.listen(port,()=>{
    console.log(`Server is running in port : ${port}`);
});     