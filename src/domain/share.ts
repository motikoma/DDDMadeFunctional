import { z } from "zod";

export const UserId = z.string().uuid();
export type UserId = z.infer<typeof UserId>;

export const Quantity = z.number().positive();
export type Quantity = z.infer<typeof Quantity>;

export type Page<T> = {
  total: number;
  page: number;
  size: number;
  items: T;
};
