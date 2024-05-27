const express=require("express")
const budgetRouter=express.Router()
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name: Budget
 *     description: Operations related to budget data
 */



 

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *
 * /budget:
 *   get:
 *     summary: Retrieve all budget for a login user
 *     description: Retrieve a list of all the budget store  in the database for a particular user.
 *     tags:
 *       - Budget  # Reference the 'Budget' tag here
 *     security:
 *       - bearerAuth: []  # Specify that the endpoint requires a bearer token
 *     responses:
 *       200:
 *         description: A list of budget retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized - Invalid or missing token.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while retrieving users.
 */














budgetRouter.get("/",async(req,res)=>{
    let {UserId}=req.body
    try {
        const income = await prisma.Budget.findMany({
          where:{
            UserId
          }
        });
        res.status(200).json({msg:income})
      } catch (error) {
         res.json({message:error.message})
      } finally {
        
        await prisma.$disconnect();
      }
})



/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API for managing budget
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *
 * /budget/add:
 *   post:
 *     summary: Add a new budget entry
 *     description: Create a new budget entry for the specified month and year.
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TotalIncome
 *               - TotalExpense
 *               - TotalSaving
 *               - Debt
 *               - Month
 *               - Year
 *             properties:
 *               TotalIncome:
 *                 type: number
 *                 description: Total income for the month
 *               TotalExpense:
 *                 type: number
 *                 description: Total expense for the month
 *               TotalSaving:
 *                 type: number
 *                 description: Total saving for the month
 *               Debt:
 *                 type: number
 *                 description: Total debt for the month
 *               Month:
 *                 type: string
 *                 description: Month for the budget entry (full form, exact name)
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 description: Year for the budget entry
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Budget entry created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Budget entry created successfully
 *                   example: Budget entry created successfully
 *       400:
 *         description: Bad request - Invalid year format or month name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Enter Year in correct format or Month name should be in full form
 *       409:
 *         description: Conflict - Budget already created for this month.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Budget already created for this month
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while creating the budget entry
 */



budgetRouter.post("/add",async(req,res)=>{
    let {TotalIncome ,TotalExpense ,TotalSaving ,Debt,Month,Year,UserId}=req.body
    let ragex=/202[4-9]/
    if(!ragex.test(Year)){
      return res.status(400).json({msg:"Enter Year  in correct format"})
}
  
    try {

      let data=await prisma.Budget.findMany({
        where:{
          Month,Year,UserId
        }
      })
        
         if(data.length!==0){
         return  res.status(409).json({ msg: "Budget already created for this month" });
         }


        const income = await prisma.Budget.create({
            data:{
               TotalExpense,TotalIncome,TotalSaving,Debt,Month,Year,UserId
            }
        });
        res.status(200).json({msg:"Budget entry created successfully"})
      }
      
      catch (error) {
         res.json({message:error.message})


      } finally {
        
        await prisma.$disconnect();
      }
})





/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API for managing budget
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *
 * /budget/update/{id}:
 *   patch:
 *     summary: Update an existing budget entry
 *     description: Update the details of an existing budget entry by its ID.
 *     tags: [Budget]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the budget entry to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TotalIncome:
 *                 type: number
 *                 description: Total income for the month
 *               TotalExpense:
 *                 type: number
 *                 description: Total expense for the month
 *               TotalSaving:
 *                 type: number
 *                 description: Total saving for the month
 *               Debt:
 *                 type: number
 *                 description: Total debt for the month
 *               Month:
 *                 type: string
 *                 description: Month for the budget entry (full form, exact name)
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 description: Year for the budget entry
 *                 example: 2024
 *     responses:
 *       200:
 *         description: Budget entry updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: The updated budget entry
 *       400:
 *         description: Bad request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Invalid input data
 *       404:
 *         description: Not found - Budget entry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Budget entry not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the budget entry
 */





budgetRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Month, Year } = req.body;

    if (!Month && !Year) {
    
      const updatedIncome = await prisma.Budget.update({
        where: { id },
        data: req.body
      });
      return res.status(200).json({ msg: "Budget entry updated successfully." });
    }

    if (Month && Year) {

      const existingEntry = await prisma.Budget.findFirst({
        where: {
          AND: [
            { Month },
            { Year },
            { NOT: { id } } 
          ]
        }
      });

      if (existingEntry) {
       
        return res.status(409).json({ msg: "A budget entry already exists for this month and year" });
      }
    } else {
     
      return res.status(400).json({ msg: "Month and Year must be provided together" });
    }

  
    const updatedIncome = await prisma.Budget.update({
      where: { id },
      data: req.body
    });

    res.status(200).json({ msg: "Budget entry updated successfully." });
  } catch (error) {
  
    res.status(400).json({ msg: error.message });
  } finally {
    await prisma.$disconnect();
  }
});




/**
 * @swagger
 * tags:
 *   name: Budget
 *   description: API for managing budget entries
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /budget/delete/{id}:
 *   delete:
 *     summary: Delete a budget entry by ID
 *     description: Delete an existing budget entry by its ID.
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the budget entry to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Budget entry deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful deletion
 *       '400':
 *         description: Bad request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Invalid input data
 *       '404':
 *         description: Not found - Budget entry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Budget entry not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the budget entry
 */

budgetRouter.delete("/delete/:id", async (req, res) => {
  try {
      const income = await prisma.Budget.delete({
          where: {
              id: req.params.id
          }
      });
      console.log(income)
      res.status(200).json({ msg: "Budget entry deleted successfully." });
  } catch (error) {
      res.status(500).json({ msg: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


module.exports={budgetRouter}