const bcrypt=require('bcrypt')
const userModel=require('../models/User')
const Jwt=require('jsonwebtoken')
const dotEnv=require('dotenv')
dotEnv.config()

let SECRET_KEY=process.env.SECRET_KEY

const signUp=async(req,res)=>{
    try {
        const {name,email,password,number}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        // console.log(hashedPassword)
        const user=await userModel.findOne({email:email})
        if(!user){
            console.log("user not found");
            const newUser= await userModel.create({name,email,password:hashedPassword,number})
            return res.status(201).send({message:"User Created Successfully"})
        }
        return res.status(400).send({error:"User Exists Already"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error:"Internal Server Error"})
    }
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body

        const user=await userModel.findOne({email:email})
        console.log(user)
        if(!user){
            return res.status(404).send({error:"User not found"})
        }
        const validatePassword=await bcrypt.compare(password,user.password)
        console.log(validatePassword)
        if(!validatePassword){
            return res.status(400).send({error:"Incorrect Password"})
        }
        let payload={email:email}
        const jwtToken=Jwt.sign(payload,(SECRET_KEY),{expiresIn:'30d'})
        return res.status(200).send({jwtToken:jwtToken})
    } catch (error) {
        console.log(error)
        return res.status(500).send({error:"Internal Server Error"})
    }
}

module.exports={signUp,login}