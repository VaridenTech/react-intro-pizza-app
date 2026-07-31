import { useState, useEffect, useDebugValue } from "react";
import type { Pizza } from "./types";

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState<Pizza | null>(null);

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      const response = await fetch("/api/pizza-of-the-day");
      const data: Pizza = await response.json();
      setPizzaOfTheDay(data);
    }

    fetchPizzaOfTheDay();
  }, []);

  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  return pizzaOfTheDay;
};
