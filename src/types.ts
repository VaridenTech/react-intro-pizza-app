export type PizzaSize = "S" | "M" | "L";

export type Pizza = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sizes: Record<PizzaSize, number>;
};

export type CartItem = {
  pizza: Pizza;
  size: PizzaSize;
  price: string;
};

export type PastOrder = {
  order_id: number;
  date: string;
  time: string;
};