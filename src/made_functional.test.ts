import { randomUUID } from "crypto";
import { CartRepository } from "./domain/cart/cart";
import { CartItemRepository } from "./domain/cart/cartItem";
import { ProductRepository } from "./domain/product/product";
import { addItemToCartUseCase } from "./usecase/addItemToCartUsecase";

const cartRepository: CartRepository = {
  load: (userId) => ({
    id: randomUUID(),
  }),
  isInCart: (cartId, productId) => false,
  getItemCount: (cartId) => 100,
};

const cartItemRepository: CartItemRepository = {
  insert(cartItem) {
    expect(cartItem.quantity).toBe(8);
  },
  update(cartItem) {
    fail();
  },
};

const productRepository: ProductRepository = {
  findOnSale(productId) {
    return randomUUID();
  },
};

test("add new item", () => {
  addItemToCartUseCase(
    cartRepository,
    cartItemRepository,
    productRepository
  )({
    userId: randomUUID(),
    productId: randomUUID(),
    quantity: 8,
  });
});
