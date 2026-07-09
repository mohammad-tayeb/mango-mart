import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, quantity = 1, variant) => {
        const existing = get().cart.find(
          (item) =>
            item._id === product._id &&
            item.variant.quantity === variant.quantity,
        );

        if (existing) {
          set({
            cart: get().cart.map((item) =>
              item._id === product._id &&
              item.variant.quantity === variant.quantity
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                  }
                : item,
            ),
          });
        } else {
          set({
            cart: [
              ...get().cart,
              {
                _id: product._id,
                name: product.name,
                image: product.images[0],

                variant,

                price: variant.offerPrice || variant.price,

                quantity,
              },
            ],
          });
        }
      },

      removeFromCart: (_id, variantQuantity) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item._id === _id && item.variant.quantity === variantQuantity),
          ),
        })),

      increaseQuantity: (_id, variantQuantity) =>
        set({
          cart: get().cart.map((item) =>
            item._id === _id && item.variant.quantity === variantQuantity
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        }),

      decreaseQuantity: (_id, variantQuantity) =>
        set({
          cart: get().cart.map((item) =>
            item._id === _id &&
            item.variant.quantity === variantQuantity &&
            item.quantity > 1
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item,
          ),
        }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "mango-cart",
    },
  ),
);

export default useCartStore;
