const express=require("express")
const expenseRouter=express.Router()
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



/**
 * @swagger
 * tags:
 *   - name: Expense
 *     description: API for managing expenses
 */

/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API for managing expenses
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /expense:
 *   get:
 *     summary: Get all expenses for a user
 *     description: Retrieve all expenses for a user by their ID.
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     responses:
 *       '200':
 *         description: Expenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful retrieval
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
 *         description: Not found - No expenses found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: No expenses found for the user
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

expenseRouter.get("/", async (req, res) => {
  let { UserId } = req.body;
  try {
      const income = await prisma.Expenditure.findMany({
          where: {
              UserId
          }
      });
      if (income.length === 0) {
          res.status(404).json({ msg: "No expenses found for the user" });
      } else {
          res.status(200).json({ msg: income });
      }
  } catch (error) {
      res.status(500).json({ msg: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API for managing expenses
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /expense/add:
 *   post:
 *     summary: Add a new expense
 *     description: Add a new expense for a user.
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Expense:
 *                 type: number
 *                 description: The expense amount
 *               Category:
 *                 type: string
 *                 description: The category of the expense
 *               Month:
 *                 type: string
 *                 description: The month of the expense (full format, exact name)
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 pattern: 202[4-9]{1}
 *                 description: The year of the expense (should match pattern 2024-2029)
 *                 example: 2024
 *     responses:
 *       '200':
 *         description: Expense added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful addition
 *       '400':
 *         description: Bad request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Enter year in correct format
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the expense
 */

expenseRouter.post("/add", async (req, res) => {
  let { Expense, Category, UserId, Month, Year } = req.body;
  let regex = /202[4-9]{1}/;
  if (!regex.test(Year)) {
      res.status(400).json({ msg: "Enter year in correct format" });
      return;
  }
  try {
      const income = await prisma.Expenditure.create({
          data: {
              Expense, Category, UserId, Month, Year
          }
      });
      res.status(200).json({ msg: "Expense added successfully"});
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API for managing expenses
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /expense/update/{id}:
 *   patch:
 *     summary: Update an expense by ID
 *     description: Update an existing expense by its ID.
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Expense:
 *                 type: number
 *                 description: The updated expense amount
 *               Category:
 *                 type: string
 *                 description: The updated category of the expense       
 *               Month:
 *                 type: string
 *                 description: The updated month of the expense (full format, exact name)
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 pattern: 202[4-9]{1}
 *                 description: The updated year of the expense (should match pattern 2024-2029)
 *                 example: 2024
 *     responses:
 *       '200':
 *         description: Expense updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful update
 *       '400':
 *         description: Bad request - Invalid input data format or missing required parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required parameters for expense update
 *       '404':
 *         description: Not found - Expense with the specified ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the expense
 */


expenseRouter.patch("/update/:id", async (req, res) => {
    let {Year}=req.body
  let ragex=/202[4-9]/
    if(!ragex.test(Year)&&Year){
      return res.status(400).json({msg:"Enter Year  in correct format"})
}
  try {
      const income = await prisma.Expenditure.update({
          where: {
              id: req.params.id
          },
          data: req.body
      });
      
      res.status(200).json({ msg: income });
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


/**
 * @swagger
 * tags:
 *   name: Expense
 *   description: API for managing expenses
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /expense/delete/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     description: Delete an existing expense by its ID.
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the expense to delete
 *     responses:
 *       '200':
 *         description: Expense deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful deletion
 *       '404':
 *         description: Not found - Expense with the specified ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the expense
 */

expenseRouter.delete("/delete/:id", async (req, res) => {
  try {
      const income = await prisma.Expenditure.delete({
          where: {
              id: req.params.id
          }
      });
      
      res.status(200).json({ msg: "Expense deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


module.exports={expenseRouter}