import sellersRepository from "../repositories/sellersRepository";

async function getAllSellers() {
  const result = await sellersRepository.findAllSellers();
  return result;
}
async function getSellers(amount: number) {
  const result = await sellersRepository.findSellers(amount);
  return result;
}
async function getSellerById(sellerId: number) {
  const result = await sellersRepository.findSellerById(sellerId);
  return result;
}
async function getTopSellers() {
  const topSellers = await sellersRepository.findTopSellers(3);

  const sellerIds = topSellers.map(slr => slr.sellerId);

  const sellersData = await sellersRepository.findManySellersById(sellerIds)

  const result = topSellers.map(e => {
    const seller = sellersData.find(seller => seller.id === e.sellerId);
    return {
      totalSales: e._sum.price,
      sales: e._count.orderId,
      sellerId: seller?.id,
      sellerName: seller?.name,
    };
  });

  return result
}

const sellersService = {
  getAllSellers,
  getSellers,
  getSellerById,
  getTopSellers
};

export default sellersService;
