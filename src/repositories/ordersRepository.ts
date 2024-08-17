import { Country } from "@prisma/client";
import { prisma } from "../config/database";

async function findAllOrders() {
  const result = await prisma.order.findMany();
  return result;
}

async function findOrders(amount: number) {
  const result = await prisma.order.findMany({
    take: amount,
  });
  return result;
}

async function findOrderById(orderId: number) {
  const result = await prisma.order.findUnique({
    where: {
      orderId: orderId,
    },
  });
  return result;
}

async function findOrdersWithPagination(page: number, pageSize: number, sellerId?: number, country?: Country) {
  const orders = await prisma.order.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      AND: [
        sellerId ? { sellerId: sellerId } : {},
        country ? { country: country } : {},
      ],
    },
    include: {
      seller: true,
    },
  });

  return orders;
}

async function countRecords(sellerId?: number, country?: Country) {
  const totalRecords = await prisma.order.count({
    where: {
      AND: [
        sellerId ? { sellerId: sellerId } : {},
        country ? { country: country } : {},
      ],
    },
  });

  return totalRecords;
}

const ordersRepository = {
  findAllOrders,
  findOrders,
  findOrderById,
  findOrdersWithPagination,
  countRecords
};

export default ordersRepository;
