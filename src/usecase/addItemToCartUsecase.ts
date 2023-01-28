import { Quantity, UserId } from "../domain/share";
import { Cart, CartId, CartRepository } from "../domain/cart/cart";
import {
  AddableCartItem,
  CartItem,
  CartItemRepository,
} from "../domain/cart/cartItem";
import { ProductId, ProductRepository } from "../domain/product/product";

type AddItemToCartCommand = {
  productId: string;
  quantity: number;
  userId: string;
};
type ParseCartItem = (cart: Cart, command: AddItemToCartCommand) => CartItem;
type ParseAddableCartItem = (cartItem: CartItem) => AddableCartItem;
type SaveCartItem = (cartItem: AddableCartItem) => void;
type FetchCart = (userId: UserId) => Cart;

export const addItemToCartUseCase = (
  cartRepository: CartRepository,
  cartItemRepository: CartItemRepository,
  productRepository: ProductRepository
) => {
  return (command: AddItemToCartCommand) => {
    const cart = fetchCart(cartRepository)(UserId.parse(command.userId));
    const cartItem = parseCartItem(cart, command);
    const addableCartItem = parseAddableCartItem(
      cartRepository,
      productRepository
    )(cartItem);
    saveCartItem(cartItemRepository)(addableCartItem);
  };
};

/**
 * ユーザーidに応じたカートの状態を取得する
 * @param cartRepository
 * @returns
 */
const fetchCart = (cartRepository: CartRepository): FetchCart => {
  return (userId: UserId) => {
    return cartRepository.load(userId);
  };
};

/**
 * CartItemを返す
 * @param command
 * @returns
 */
const parseCartItem: ParseCartItem = (
  cart: Cart,
  command: AddItemToCartCommand
) => {
  return CartItem.parse({
    cartId: CartId.parse(cart.id),
    productId: ProductId.parse(command.productId),
    quantity: Quantity.parse(command.quantity),
  });
};

/**
 * 追加可能なCartItemを返す
 * @param cartRepository
 * @param productRepository
 * @returns
 */
const parseAddableCartItem = (
  cartRepository: CartRepository,
  productRepository: ProductRepository
): ParseAddableCartItem => {
  return (cartItem: CartItem) => {
    if (
      cartRepository.getItemCount(cartItem.cartId) + cartItem.quantity >
      10000
    ) {
      throw Error(`同一商品の上限数に達しています`);
    }
    return {
      // カートに商品が存在するかどうか
      isNew: cartRepository.isInCart(cartItem.cartId, cartItem.productId),
      cartId: cartItem.cartId,
      // 販売中の商品かどうか
      productId: productRepository.findOnSale(cartItem.productId),
      quantity: cartItem.quantity,
    };
  };
};

/**
 * カートアイテムの保存
 * @param cartItemRepository
 * @returns
 */
const saveCartItem = (cartItemRepository: CartItemRepository): SaveCartItem => {
  return (cartItem: AddableCartItem) => {
    if (cartItem.isNew) {
      cartItemRepository.insert({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });
    } else {
      cartItemRepository.update({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });
    }
  };
};
