import { getAllOrders, getOrderById, getOrders } from '../controllers/ordersController'
import { Router } from 'express'

const ordersRouter = Router()

ordersRouter
  .get("/all", getAllOrders)
  .get("/", getOrders)
  .get("/:orderId", getOrderById)

export { ordersRouter }