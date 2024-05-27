const express=require("express")
const userRouter=express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name:A- User
 *     description: Operations related to users
 */


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users stored in the database.
 *     tags:
 *       - A- User  # Reference the 'User' tag here
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: array
 *             
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */



userRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ msg: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});




/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided name, email, and password.
 *     tags:
 *       - A- User  # Reference the 'User' tag here
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: object
 *       409:
 *         description: Account already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */


userRouter.post("/signup",async(req,res)=>{
     let {name,email,password}=req.body
     let User=await prisma.User.findUnique({
      where:{
        email
      }
    })
       if(User){
       return res.status(409).json({ msg: "Account already exists. Please log in instead." });
       }
    try {
        bcrypt.hash(password, 10, async function(err, hash) {
            if(err){
                res.status({msg:err.status}).json({msg:err.message})
            }
            const users = await prisma.User.create(({
                data: {
                  name,
                  email,
                  password: hash,
                },
              }));
        res.status(201).json({msg:"User registered successfully."})

        })
        
      } catch (error) {
         res.json({message:error.message})
      } finally {
        
        await prisma.$disconnect()
      }
})





/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate a user with the provided email and password.
 *     tags:
 *       - A- User  # Reference the 'User' tag here
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */








userRouter.post("/login",async(req,res)=>{
    let {email,password}=req.body
     try {
         const user = await prisma.User.findUnique({
               where: {
               email,
               },
            });

            if(!user){
              return res.status(404).json({ msg: 'User not found' });
         }
          else{
              bcrypt.compare(password, user.password, function(err, result) {
                 if(result){
                var token = jwt.sign({ userId: user.id },process.env.privateKey );
                res.status(200).json({msg:"login successful",token})
                }
                else{
                return res.status(401).json({ message: 'Invalid  password' });
               }
        })

      }
       

       
       
     } catch (error) {
        res.json({message:error.message})
     } finally {
       
       await prisma.$disconnect();
     }
})

module.exports={userRouter}