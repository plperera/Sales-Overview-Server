import { getAllSellers, getSellerById, getSellers, getTopSellers } from '../controllers/sellersController'
import { Router } from 'express'

const sellersRouter = Router()

sellersRouter
  .get("/all", getAllSellers)
  .get("/top", getTopSellers)
  .get("/unique/:sellerId", getSellerById)  

export { sellersRouter }
