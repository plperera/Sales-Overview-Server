import { Country, Order, Seller } from "@prisma/client";
import ordersRepository from "../repositories/ordersRepository";

type OrderWithSeller = Order & {
  seller: Seller;
};

function FormatOrder(order: OrderWithSeller[]) {
  const newFormat = order.map(e => ({
    country: e.country,
    orderId: e.orderId,
    price: e.price,
    product: e.product,
    seller: e.seller.name,
  }));
  return newFormat;
}

async function getAllOrders() {
  const result = await ordersRepository.findAllOrders();
  return result;
}
async function getOrders(amount: number) {
  const result = await ordersRepository.findOrders(amount);
  return result;
}
async function getOrderById(amount: number) {
  const result = await ordersRepository.findOrderById(amount);
  return result;
}
async function getOrdersWithPagination(page: number, pageSize: number, sellerId?: number, country?: Country) {
  const totalRecords = await ordersRepository.countRecords(sellerId, country);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const orders = await ordersRepository.findOrdersWithPagination(page, pageSize, sellerId, country);

  return {
    first: 1,
    prev: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    lastPage: totalPages,
    totalItems: totalRecords,
    ordersData: FormatOrder(orders),
  };
}

const ordersService = {
  getAllOrders,
  getOrders,
  getOrderById,
  getOrdersWithPagination
};

export default ordersService;
