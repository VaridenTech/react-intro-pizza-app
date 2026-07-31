import { useEffect, useState } from "react";
import Pizza from "./Pizza";
import type { Pizza as PizzaType, PizzaSize } from "./types";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function Order() {
  // pizzaType and pizzaSize location
  const [pizzaType, setPizzaType] = useState<string>("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
  const price = selectedPizza ? intl.format(selectedPizza.sizes[pizzaSize]) : "";

  useEffect(() => {
    fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson: PizzaType[] = await pizzasRes.json();
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  return (
    <div className="order">
      <h2>Create Order</h2>
      <form>
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
    </div>
  );
}
