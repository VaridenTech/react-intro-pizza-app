import type { PastOrder } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;

export default async function getPastOrders(
  page: number,
): Promise<PastOrder[]> {
  const response = await fetch(`${apiUrl}/api/past-orders?page=${page}`);
  const data = await response.json();
  return data;
}
