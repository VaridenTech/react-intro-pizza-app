// delete the React import
import { createRoot } from "react-dom/client";
import Pizza from "./Pizza";

// delete the Pizza component

const App = () => {
  return (
    <div>
      <h1>Pizza app – Order Now</h1>
      <Pizza name="Pepperoni" description="Mozzarella Cheese, Pepperoni" image={"/public/pizzas/pepperoni.webp"}/>
      <Pizza
        name="The Hawaiian Pizza"
        description="Sliced Ham, Pineapple, Mozzarella Cheese"
        image={"/public/pizzas/hawaiian.webp"}
      />
      <Pizza
        name="The Big Meat Pizza"
        description="Bacon, Pepperoni, Italian Sausage, Chorizo Sausage"
        image={"/public/pizzas/big_meat.webp"}
      />
    </div>
  );
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("ไม่พบ element ที่มี id=\"root\" ใน index.html");
}
const root = createRoot(container);
root.render(<App />);