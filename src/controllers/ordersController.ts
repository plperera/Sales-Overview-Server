import ordersService from "@/services/ordersService";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getAllOrders(req: Request, res: Response) {
  try {

    const allOrders = await ordersService.getAllOrders();
  
    return res.send(allOrders).status(httpStatus.OK);

  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
export async function getOrders(req: Request, res: Response) {
  try {

    const { amount = 10 } = req.query
    
    if (isNaN(Number(amount))) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  
    const allOrders = await ordersService.getOrders(Number(amount));

    return res.send(allOrders).status(httpStatus.OK);

  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
export async function getOrderById(req: Request, res: Response) {
  try {

    const { orderId } = req.params
    
    if (isNaN(Number(orderId))) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  
    const uniqueOrder = await ordersService.getOrderById(Number(orderId));

    if(!uniqueOrder){
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    
    return res.send(uniqueOrder).status(httpStatus.OK);

  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

