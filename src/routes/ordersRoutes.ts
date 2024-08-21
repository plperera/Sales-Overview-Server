import { validateQueryParams } from '../middlewares/validateQueryParams'
import { getAllOrders, getOrderById, getOrders, getOrdersWithPagination } from '../controllers/ordersController'
import { Router } from 'express'

const ordersRouter = Router()

ordersRouter
  .get("/all", getAllOrders)
  .get("/unique/:orderId", getOrderById)
  .get("/pagination", validateQueryParams, getOrdersWithPagination)

export { ordersRouter }
