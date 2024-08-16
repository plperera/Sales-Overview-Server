import { getAllSellers, getSellerById, getSellers } from '../controllers/sellersController'
import { Router } from 'express'

const sellersRouter = Router()

sellersRouter
  .get("/all", getAllSellers)
  .get("/", getSellers)
  .get("/:sellerId", getSellerById)

export { sellersRouter }