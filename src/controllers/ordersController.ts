import { Country } from "@prisma/client";
import ordersService from "../services/ordersService";
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

export async function getOrdersWithPagination(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const country = req.query.country as string | undefined;
    const sellerId = req.query.sellerId ? parseInt(req.query.sellerId as string, 10) : undefined;
    const orderColumn = req.query.orderColumn as string | undefined;
    const orderDirection = req.query.orderDirection as string | undefined;  

    const paginatedOrders = await ordersService.getOrdersWithPagination(
      page, 
      pageSize, 
      sellerId, 
      country as Country | undefined, 
      orderColumn,
      orderDirection
    );

    if (!paginatedOrders) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.send(paginatedOrders).status(httpStatus.OK);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

