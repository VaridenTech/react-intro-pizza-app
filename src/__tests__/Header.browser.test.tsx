import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import Header from "../Header";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
} from "@tanstack/react-router";
import { CartContext } from "../contexts";
import type { CartItem } from "../types";

// สร้าง cart จริงตาม type แทน mock ที่ "แค่พอให้ผ่าน"
function makeCart(count: number): CartItem[] {
  return Array.from({ length: count }, (_, i) => ({
    pizza: {
      id: `pizza-${i}`,
      name: `Test Pizza ${i}`,
      category: "Classic",
      description: "a pizza for testing",
      image: "/public/pizzas/pepperoni.webp",
      sizes: { S: 9.75, M: 12.5, L: 15.25 },
    },
    size: "M",
    price: "$12.50",
  }));
}

function renderHeaderWithCart(cart: CartItem[]) {
  const rootRoute = createRootRoute({
    component: () => (
      <CartContext.Provider value={[cart, () => {}]}>
        <Header />
      </CartContext.Provider>
    ),
  });

  const router = createRouter({ routeTree: rootRoute });
  return render(<RouterProvider router={router} />);
}

test("correctly renders a header with a zero cart count", async () => {
  const screen = await renderHeaderWithCart([]);

  const itemsInCart = screen.getByTestId("cart-number");

  await expect.element(itemsInCart).toBeInTheDocument();
  await expect.element(itemsInCart).toHaveTextContent("0");
});

test("correctly renders a header with a three cart count", async () => {
  const screen = await renderHeaderWithCart(makeCart(3));

  const itemsInCart = screen.getByTestId("cart-number");

  await expect.element(itemsInCart).toBeInTheDocument();
  await expect.element(itemsInCart).toHaveTextContent("3");
});
