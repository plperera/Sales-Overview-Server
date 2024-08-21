import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
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

async function validateSeller(sellerId: number, prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
  const sellerExists = await prisma.seller.findUnique({
    where: { id: sellerId },
  });

  if (!sellerExists) {
    throw new Error(`Invalid sellerId: ${sellerId}`);
  }
}

async function validateOrder(orderId: number, prisma: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
  const orderExists = await prisma.order.findUnique({
    where: { orderId },
  });

  if (orderExists) {
    throw new Error(`Order with ID ${orderId} already exists`);
  }
}

function validateOrderFields(order: any) {
  if (!order.product || typeof order.product !== 'string') {
    throw new Error(`Invalid product name: ${order.product}`);
  }
  if (!order.price || typeof order.price !== 'number' || order.price <= 0) {
    throw new Error(`Invalid price: ${order.price}`);
  }
  if (!Object.values(Country).includes(order.country)) {
    throw new Error(`Invalid country: ${order.country}`);
  }
  if (!order.orderId || typeof order.orderId !== 'number') {
    throw new Error(`Invalid order ID: ${order.orderId}`);
  }
}

function validateSellerFields(seller: any) {
  if (!seller.name || typeof seller.name !== 'string') {
    throw new Error(`Invalid seller name: ${seller.name}`);
  }
  if (!seller.id || typeof seller.id !== 'number') {
    throw new Error(`Invalid seller id: ${seller.id}`);
  }
}

async function main() {
  const sellers: SellerFile[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/sellers.json"), "utf-8")
  );

  const orders: OrderFile[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/orders.json"), "utf-8")
  );

  await prisma.$transaction(async (prisma) => {
    await prisma.order.deleteMany();
    await prisma.seller.deleteMany();

    for (const seller of sellers) {
      validateSellerFields(seller);

      await prisma.seller.create({
        data: {
          id: seller.id,
          name: seller.name,
        },
      });
    }
    
    for (const order of orders) {
      validateOrderFields(order);
      await validateSeller(order.seller, prisma);
      await validateOrder(order.orderId, prisma);

      const adjustedPrice = Math.trunc(order.price * 100);
      
      await prisma.order.create({
        data: {
          orderId: order.orderId,
          product: order.product,
          sellerId: order.seller,
          price: adjustedPrice,
          country: order.country,
        },
      });
    }
  });

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
