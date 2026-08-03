import { useContext, useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import Pizza from "../Pizza";
import Cart from "../Cart";
import { CartContext } from "../contexts";
import type { Pizza as PizzaType, PizzaSize } from "../types";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const apiUrl = import.meta.env.VITE_API_URL;

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  // pizzaType and pizzaSize location
  const [pizzaType, setPizzaType] = useState<string>("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useContext(CartContext);

  const selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
  const price = selectedPizza ? intl.format(selectedPizza.sizes[pizzaSize]) : "";

  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    const pizzasRes = await fetch(`${apiUrl}/api/pizzas`);
    const pizzasJson: PizzaType[] = await pizzasRes.json();
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  async function checkout() {
    setLoading(true);

    await fetch(`${apiUrl}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  function addToCart() {
    if (!selectedPizza) return;
    setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form action={addToCart}>
        <div>
          <div>
            <label htmlFor="pizza-type">Pizza Type</label>
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setPizzaType(e.target.value)
              }
              name="pizza-type"
              value={pizzaType}
            >
              {pizzaTypes.map((pizza) => (
                <option key={pizza.id} value={pizza.id}>
                  {pizza.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pizza-size">Pizza Size</label>
            <div>
              <span>
                <input
                  checked={pizzaSize === "S"}
                  type="radio"
                  name="pizza-size"
                  value="S"
                  id="pizza-s"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPizzaSize(e.target.value as PizzaSize)
                  }
                />
                <label htmlFor="pizza-s">Small</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "M"}
                  type="radio"
                  name="pizza-size"
                  value="M"
                  id="pizza-m"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPizzaSize(e.target.value as PizzaSize)
                  }
                />
                <label htmlFor="pizza-m">Medium</label>
              </span>
              <span>
                <input
                  checked={pizzaSize === "L"}
                  type="radio"
                  name="pizza-size"
                  value="L"
                  id="pizza-l"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPizzaSize(e.target.value as PizzaSize)
                  }
                />
                <label htmlFor="pizza-l">Large</label>
              </span>
            </div>
          </div>
          <button type="submit">Add to Cart</button>
        </div>
        {loading || !selectedPizza ? (
          <h3>Loading...</h3>
        ) : (
          <div className="order-pizza">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
      {loading ? <h2>LOADING …</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}
