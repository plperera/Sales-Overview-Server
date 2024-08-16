import ordersRepository from "../repositories/ordersRepository";

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

const ordersService = {
  getAllOrders,
  getOrders,
  getOrderById
};

export default ordersService;
