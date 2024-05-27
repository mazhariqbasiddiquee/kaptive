const express=require("express")
const app=express()
var cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const {swaggerDocs} = require('./swaggerConfig.js'); 
const {uiCustomOptions}=require("./swaggerConfig.js")
const {userRouter}=require("./route/user.js")
const {incomeRouter}=require("./route/income.js")
const {expenseRouter}=require("./route/expense.js")
const {budgetRouter}=require("./route/budget.js")
const {transactionRouter}=require("./route/transaction.js")
const {auth}=require("./middleware/auth.js")
require("dotenv").config()
app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs,uiCustomOptions, { explorer: true }));
app.use("/user",userRouter)

app.use(auth)
app.use("/income",incomeRouter)
app.use("/expense",expenseRouter)
app.use("/budget",budgetRouter)
app.use("/transaction",transactionRouter)

app.listen(process.env.PORT,(err)=>{
  console.log("Server is running")
})