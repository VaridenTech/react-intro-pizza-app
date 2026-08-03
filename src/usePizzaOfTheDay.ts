import { useState, useEffect, useDebugValue } from "react";
import type { Pizza } from "./types";

const apiUrl = import.meta.env.VITE_API_URL;

export const usePizzaOfTheDay = () => {
  const [pizzaOfTheDay, setPizzaOfTheDay] = useState<Pizza | null>(null);

  useEffect(() => {
    async function fetchPizzaOfTheDay() {
      const response = await fetch(`${apiUrl}/api/pizza-of-the-day`);
      const data: Pizza = await response.json();
      setPizzaOfTheDay(data);
    }

    fetchPizzaOfTheDay();
  }, []);

  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  return pizzaOfTheDay;
};
