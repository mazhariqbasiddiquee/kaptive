const express=require("express")
const transactionRouter=express.Router()
require('dotenv').config()
const { PrismaClient, Month } = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name: Transaction
 *     description: Operations related to Transaction data
 */



/**
 * @swagger
 * /transaction/expense:
 *   get:
 *     summary: Get expenses for a specific month and year
 *     description: Retrieve expenses for a specific month and year, optionally filtered by user ID.
 *     tags: [Transaction]
 *     parameters:
 *       - in: query
 *         name: Month
 *         required: true
 *         description: Month for which expenses are to be retrieved (e.g., January, February).
 *         schema:
 *           type: string
 *       - in: query
 *         name: Year
 *         required: true
 *         description: Year for which expenses are to be retrieved (e.g., 2024).
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalExpense:
 *                   type: number
 *                   description: Total expense for the specified month and year
 *                   example: 500
 *                 expenses:
 *                   type: array
 *                   description: List of expenses for the specified month and year
 *       '403':
 *         description: Forbidden. Access to expenses is not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving expenses
 */


transactionRouter.get("/expense",async(req,res)=>{
    let {Month,Year}=req.query
    let {UserId}=req.body
    Year=Number(Year)
    let ragex=/202[4-9]/
    if(!ragex.test(Year)){
      return res.status(400).json({msg:"Enter Year  in correct format"})
}
    try{
        const [expenses, totalExpenseResult] = await prisma.$transaction([
            prisma.expenditure.findMany({
              where: {
                Month,
                Year,
                UserId
              }
            }),
            prisma.expenditure.aggregate({
              where: {
                Month,
                Year,
                UserId
              },
              _sum: {
                Expense: true
              }
            })
          ]);
      
      
          const totalExpense = totalExpenseResult._sum.Expense || 0;
      
          res.status(200).json({
            totalExpense,
            expenses
          });
       
    }
    catch(err){
        res.status(403).json({msg:err.message})
    }
    finally{
        await prisma.$disconnect
    }
})


/**
 * @swagger
 * /transaction/income:
 *   get:
 *     summary: Get income for a specific month and year
 *     description: Retrieve income for a specific month and year, optionally filtered by user ID.
 *     tags: [Transaction]
 *     parameters:
 *       - in: query
 *         name: Month
 *         required: true
 *         description: Month for which income is to be retrieved (e.g., January, February).
 *         schema:
 *           type: string
 *       - in: query
 *         name: Year
 *         required: true
 *         description: Year for which income is to be retrieved (e.g., 2024).
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved income
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TotalIncome:
 *                   type: number
 *                   description: Total income for the specified month and year
 *                   example: 3000
 *                 Income:
 *                   type: array
 *                   description: List of income for the specified month and year
 *       '403':
 *         description: Forbidden. Access to income is not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving income
 */



transactionRouter.get("/income",async(req,res)=>{
    let {Month,Year}=req.query
    let {UserId}=req.body
    Year=Number(Year)
    let ragex=/202[4-9]/
    if(!ragex.test(Year)){
      return res.status(400).json({msg:"Enter Year  in correct format"})
}
    try{
        const [Income, totalIncomeResult] = await prisma.$transaction([
            prisma.income.findMany({
              where: {
                Month,
                Year,
                UserId
              }
            }),
            prisma.income.aggregate({
              where: {
                Month,
                Year,
                UserId
              },
              _sum: {
                Earning: true
              }
            })
          ]);
      
      
          const TotalIncome = totalIncomeResult._sum.Earning || 0;
      
          res.status(200).json({
            TotalIncome,
            Income
          });
       
    }
    catch(err){
        res.status(403).json({msg:err.message})
    }
    finally{
        await prisma.$disconnect
    }
})

module.exports={transactionRouter}