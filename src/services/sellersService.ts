import { Country, Order, Seller } from "@prisma/client";
import sellersRepository from "../repositories/sellersRepository";

type SellerWithOrder = Seller & {
  Order: Order[];
};

async function getAllSellers() {
  const result = await sellersRepository.findAllSellers();
  return result;
}
async function getSellers(amount: number) {
  const result = await sellersRepository.findSellers(amount);
  return result;
}
async function getSellerWithOrderById(sellerId: number) {
  const result = await sellersRepository.findSellerWithOrderById(sellerId);
  return result;
}
async function getTopSellers() {
  const topSellers = await sellersRepository.findTopSellers(3);

  const sellerIds = topSellers.map(slr => slr.sellerId);

  const sellersData = await sellersRepository.findManySellersById(sellerIds)

  const result = topSellers.map(e => {
    const seller = sellersData.find(seller => seller.id === e.sellerId);
    return {
      totalSales: e._sum.price ? (e._sum.price / 100) : (null),
      sales: e._count.orderId,
      sellerId: seller?.id,
      sellerName: seller?.name,
    };
  });

  return result
}
function convertData(body: SellerWithOrder) {
  const totalSales = body.Order.length;
  const totalValue = body.Order.reduce((acc, order) => acc + (order.price / 100), 0);

  const salesByCountry = body.Order.reduce((acc, order) => {
    const country = acc.find((c) => c.name === order.country);
    if (country) {
      country.amount += order.price / 100;
    } else {
      acc.push({
        name: order.country,
        amount: order.price / 100,
        color: getColorByCountry(order.country),
      });
    }
    return acc;
  }, [] as { name: string; amount: number; color: string }[])
  .sort((a, b) => b.amount - a.amount);

  const topProducts = body.Order.reduce((acc, order) => {
    const product = acc.find((p) => p.name === order.product);
    if (product) {
      product.sales += 1;
    } else {
      acc.push({ name: order.product, sales: 1 });
    }
    return acc;
  }, [] as { name: string; sales: number }[]).sort((a, b) => b.sales - a.sales).slice(0, 3);

  return {
    name: body.name,
    totalSales,
    totalValue,
    salesByCountry,
    topProducts,
  };
}

const getColorByCountry = (country: Country) => {
  const colors = {
    BRA: '#36A0DD',
    ARG: '#9452FF',
    MEX: '#DD36AB',
  };

  return colors[country] || '#000000';
};

const sellersService = {
  getAllSellers,
  getSellers,
  getSellerWithOrderById,
  getTopSellers,
  convertData
};

export default sellersService;
