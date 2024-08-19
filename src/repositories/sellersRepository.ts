import { prisma } from "../config/database";

async function findAllSellers() {
  const result = await prisma.seller.findMany()
  return result;
}

async function findSellers(amount: number) {
  const result = await prisma.seller.findMany({
    take: amount
  });
  return result;
}

async function findSellerById(sellerId: number) {
  const result = await prisma.seller.findUnique({
    where: {
      id: sellerId
    }
  });
  return result;
}

async function findManySellersById(sellerIds: number[]) {
  const result = await prisma.seller.findMany({
    where: {
      id: { in: sellerIds },
    },
  });
  return result;
}

async function findTopSellers(takeNumber: number) {
  const result = await prisma.order.groupBy({
    by: ['sellerId'],
    _sum: {
      price: true,
    },
    _count: {
      orderId: true,
    },
    orderBy: {
      _sum: {
        price: 'desc',
      },
    },
    take: takeNumber,
  });

  return result
}

const sellersRepository = {
  findAllSellers,
  findSellers,
  findSellerById,
  findTopSellers,
  findManySellersById
};

export default sellersRepository;
