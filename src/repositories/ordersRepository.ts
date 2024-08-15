import { prisma } from "../config/database";

async function findAllOrders() {
  const result = await prisma.order.findMany()
  return result;
}

async function findOrders(amount: number) {
  const result = await prisma.order.findMany({
    take: amount
  });
  return result;
}

async function findOrderById(orderId: number) {
  const result = await prisma.order.findUnique({
    where: {
      orderId: orderId
    }
  });
  return result;
}

const ordersRepository = {
  findAllOrders,
  findOrders,
  findOrderById
};

export default ordersRepository;
