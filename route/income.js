const express=require("express")
const incomeRouter=express.Router()
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name: Income
 *     description: API for managing income
 */


/**
 * @swagger
 * tags:
 *   name: Income
 *   description: API for managing income
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /income:
 *   get:
 *     summary: Get income data by user ID
 *     description: Retrieve income data based on the user ID.
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     responses:
 *       '200':
 *         description: Successful operation. Returns income data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: array
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching income data
 */

incomeRouter.get("/", async (req, res) => {
  let { UserId } = req.query;
  try {
      const income = await prisma.Income.findMany({
          where: {
              UserId
          }
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
 *   name: Income
 *   description: API for managing income
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 * 
 * /income/add:
 *   post:
 *     summary: Add new income data
 *     description: Add new income data for a user.
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EarningMode:
 *                 type: string
 *               Earning:
 *                 type: number
 *               Month:
 *                 type: string
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 example: 2024
 *             required:
 *               - EarningMode
 *               - Earning
 *               - UserId
 *               - Month
 *               - Year
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the added income data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       '400':
 *         description: Bad request. Invalid input data format.
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
 *                   example: An error occurred while adding income data
 */

incomeRouter.post("/add", async (req, res) => {
  let { EarningMode, Earning, UserId, Month, Year } = req.body;
  let regex = /202[4-9]{1}/;
  if (!regex.test(Year)) {
      return res.status(400).json({ msg: "Enter year in correct format" });
  }
  try {
      const income = await prisma.Income.create({
          data: {
              EarningMode, Earning, UserId, Month, Year
          }
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
 * /income/update/{id}:
 *   patch:
 *     summary: Update income data
 *     description: Update existing income data by providing the income ID.
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the income data to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EarningMode:
 *                 type: string
 *               Earning:
 *                 type: number
 *               Month:
 *                 type: string
 *                 example: "January"
 *               Year:
 *                 type: number
 *                 example: 2024
 *     responses:
 *       '200':
 *         description: Successful operation. Returns the updated income data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       '400':
 *         description: Bad request. Invalid input data format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Enter data in correct format
 *       '404':
 *         description: Not found. Income data with the provided ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Income data not found with the provided ID
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating income data
 */


incomeRouter.patch("/update/:id", async (req, res) => {
  let {Year}=req.body
  let ragex=/202[4-9]/
    if(!ragex.test(Year)&&Year){
      return res.status(400).json({msg:"Enter Year  in correct format"})
}
  try {
    const updatedIncome = await prisma.Income.update({
      where: {
        id: req.params.id
      },
      data: req.body
    });

  

    res.status(200).json({ msg: "Successfully updated the data"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
});



/**
 * @swagger
 * /income/delete/{id}:
 *   delete:
 *     summary: Delete income data
 *     description: Deletes income data with the specified ID.
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the income data to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     responses:
 *       '200':
 *         description: Income data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Income data deleted successfully
 *       '404':
 *         description: Not found. Income data with the provided ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Income data not found with the provided ID
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting income data
 */


incomeRouter.delete("/delete/:id", async (req, res) => {
  try {
      const income = await prisma.Income.delete({
          where: {
              id: req.params.id
          }
      });
      res.status(200).json({ msg: "Income data deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await prisma.$disconnect();
  }
});


module.exports={incomeRouter}