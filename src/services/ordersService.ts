import { Country, Order, Seller } from "@prisma/client";
import ordersRepository from "../repositories/ordersRepository";

type OrderWithSeller = Order & {
  seller: Seller;
};

function FormatOrdersWithSeller(order: OrderWithSeller[]) {
  const newFormat = order.map(e => ({
    country: e.country,
    orderId: e.orderId,
    price: e.price / 100,
    product: e.product,
    seller: e.seller.name,
    sellerId: e.sellerId
  }));
  return newFormat;
}

function FormatOrders(order: Order[]) {
  const newFormat = order.map(e => ({
    country: e.country,
    orderId: e.orderId,
    price: e.price / 100,
    product: e.product,
    sellerId: e.sellerId
  }));
  return newFormat;
}

function FormatUniqueOrder(order: Order) {
  const newFormat = ({
    country: order.country,
    orderId: order.orderId,
    price: order.price / 100,
    product: order.product,
    sellerId: order.sellerId
  });
  return newFormat;
}

async function getAllOrders() {
  const result = await ordersRepository.findAllOrders();
  return FormatOrders(result);
}
async function getOrders(amount: number) {
  const result = await ordersRepository.findOrders(amount);
  return FormatOrders(result);
}
async function getOrderById(amount: number) {
  let result = await ordersRepository.findOrderById(amount);
  if (result){
    result = FormatUniqueOrder(result)
  }
  return result;
}
async function getOrdersWithPagination(page: number, pageSize: number, sellerId?: number, country?: Country, orderColumn?: string,  orderDirection?: string) {

  const totalRecords = await ordersRepository.countRecords(sellerId, country);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const orders = await ordersRepository.findOrdersWithPagination(page, pageSize, sellerId, country, orderColumn, orderDirection);

  return {
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    lastPage: totalPages,
    totalItems: totalRecords,
    ordersData: FormatOrdersWithSeller(orders),
  };
}

const ordersService = {
  getAllOrders,
  getOrders,
  getOrderById,
  getOrdersWithPagination
};

export default ordersService;
