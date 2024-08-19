import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Country } from '@prisma/client';

export function validateQueryParams(req: Request, res: Response, next: NextFunction) {
  const page = parseInt(req.query.page as string, 10);
  const pageSize = parseInt(req.query.pageSize as string, 10);

  if (isNaN(page) || page < 1) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "Invalid page value" });
  }

  if (isNaN(pageSize) || pageSize < 1) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "Invalid pageSize value" });
  }

  const country = req.query.country as string | undefined;
  if (country && !Object.values(Country).includes(country as Country)) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "Invalid country value" });
  }

  const sellerId = req.query.sellerId ? parseInt(req.query.sellerId as string, 10) : undefined;
  if (sellerId && isNaN(sellerId)) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: "Invalid sellerId value" });
  }

  const orderBy = req.query.orderBy as string | undefined;
  if (orderBy) {
    const [column, direction] = orderBy.split('-');
    const validColumns = ['orderId', 'product', 'price', 'seller', 'country'];
    const validDirections = ['ASC', 'DESC'];

    if (!validColumns.includes(column) || !validDirections.includes(direction)) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Invalid orderBy parameter" });
    }

    req.query.orderColumn = column;
    req.query.orderDirection = direction.toLowerCase();
  }

  next();
}
