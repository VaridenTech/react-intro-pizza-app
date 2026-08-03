// delete the React import
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Header from "./Header";
import Order from "./Order";
import PizzaOfTheDay from "./PizzaOfTheDay";
import { CartContext } from "./contexts";
import type { CartItem } from "./types";

// delete the Pizza component

const App = () => {
  const cartHook = useState<CartItem[]>([]);
  return (
    <StrictMode>
      <CartContext.Provider value={cartHook}>
        <div>
          <Header />
          <Order />
          <PizzaOfTheDay />
        </div>
      </CartContext.Provider>
    </StrictMode>
  );
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("ไม่พบ element ที่มี id=\"root\" ใน index.html");
}
const root = createRoot(container);
root.render(<App />);