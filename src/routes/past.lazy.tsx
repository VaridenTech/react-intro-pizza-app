import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/past")({
  component: PastOrdersRoute,
});

function PastOrdersRoute() {
  const [page, setPage] = useState<number>(1);
  const [focusedOrder, setFocusedOrder] = useState<number | undefined>();
  const { isLoading, data } = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  });

  const { data: pastOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    // enabled รับประกันว่า queryFn จะไม่ถูกเรียกตอน focusedOrder เป็น undefined
    // แต่ TypeScript มองความสัมพันธ์นี้ไม่เห็น ! จึงสมเหตุสมผลตรงนี้
    queryFn: () => getPastOrder(focusedOrder!),
    enabled: !!focusedOrder,
    staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds
  });

  // เช็ค !data ด้วย เพราะ isLoading เป็น false ตอน query error ได้ แล้ว data ยัง undefined
  if (isLoading || !data) {
    return (
      <div className="past-orders">
        <h2>LOADING …</h2>
      </div>
    );
  }

  return (
    <div className="past-orders">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Date</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.order_id}>
              <td>
                <button onClick={() => setFocusedOrder(order.order_id)}>
                  {order.order_id}
                </button>
              </td>
              <td>{order.date}</td>
              <td>{order.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pages">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <div>{page}</div>
        <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
      {focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {pastOrderData ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                  <tr key={`${pizza.pizzaTypeId}_${pizza.size}`}>
                    <td>
                      <img src={pizza.image} alt={pizza.name} />
                    </td>
                    <td>{pizza.name}</td>
                    <td>{pizza.size}</td>
                    <td>{pizza.quantity}</td>
                    <td>{intl.format(pizza.price)}</td>
                    <td>{intl.format(pizza.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading …</p>
          )}
          <button onClick={() => setFocusedOrder(undefined)}>Close</button>
        </Modal>
      ) : null}
    </div>
  );
}
