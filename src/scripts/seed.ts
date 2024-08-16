import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type OrderFile = {
  orderId: number;
  product: string;
  seller: number;
  country: Country;
  price: number;
};

type SellerFile = {
  name: string;
  id: number;
};

enum Country {
  BRA = "BRA",
  ARG = "ARG",
  MEX = "MEX",
}

async function main() {
  const sellers: SellerFile[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "sellers.json"), "utf-8")
  );

  const orders: OrderFile[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "orders.json"), "utf-8")
  );

  await prisma.order.deleteMany();
  await prisma.seller.deleteMany();

  for (const seller of sellers) {
    await prisma.seller.create({
      data: {
        id: seller.id,
        name: seller.name,
      },
    });
  }

  for (const order of orders) {
    await prisma.order.create({
      data: {
        orderId: order.orderId,
        product: order.product,
        sellerId: order.seller,
        price: order.price,
        country: order.country,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
