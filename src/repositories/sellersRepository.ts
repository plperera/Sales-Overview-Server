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

const sellersRepository = {
  findAllSellers,
  findSellers,
  findSellerById
};

export default sellersRepository;
