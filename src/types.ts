export type PizzaSize = "S" | "M" | "L";

export type Pizza = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sizes: Record<PizzaSize, number>;
};