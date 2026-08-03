import type { PastOrderDetail } from "../types";

const apiUrl = import.meta.env.VITE_API_URL;

export default async function getPastOrder(
  order: number,
): Promise<PastOrderDetail> {
  const response = await fetch(`${apiUrl}/api/past-order/${order}`);
  const data = await response.json();
  return data;
}
