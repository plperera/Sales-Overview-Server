import sellersRepository from "@/repositories/sellersRepository";

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

const sellersService = {
  getAllSellers,
  getSellers,
  getSellerById
};

export default sellersService;
