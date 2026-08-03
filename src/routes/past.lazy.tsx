import { Suspense, useState, use } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import getPastOrders from "../api/getPastOrders";
import getPastOrder from "../api/getPastOrder";
import Modal from "../Modal";
import ErrorBoundary from "../ErrorBoundary";
import type { PastOrder } from "../types";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/past")({
  component: ErrorBoundaryWrappedPastOrderRoutes,
});

function ErrorBoundaryWrappedPastOrderRoutes() {
  // query ต้องอยู่ใน parent เพราะ promise ต้องมีอยู่ภายนอก component ที่ถูก suspend
  // ไม่งั้นมันจะถูกสร้างใหม่ทุกครั้งที่ render
  const [page, setPage] = useState<number>(1);
  const loadedPromise = useQuery({
    queryKey: ["past-orders", page],
    queryFn: () => getPastOrders(page),
    staleTime: 30000,
  }).promise;
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="past-orders">
            <h2>Loading Past Orders …</h2>
          </div>
        }
      >
        <PastOrdersRoute
          loadedPromise={loadedPromise}
          page={page}
          setPage={setPage}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

type PastOrdersRouteProps = {
  loadedPromise: Promise<PastOrder[]>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

function PastOrdersRoute({
  loadedPromise,
  page,
  setPage,
}: PastOrdersRouteProps) {
  // ไม่มี undefined ปนมาแล้ว เพราะการรอข้อมูลเป็นหน้าที่ของ <Suspense>
  const data = use(loadedPromise);
  const [focusedOrder, setFocusedOrder] = useState<number | undefined>();

  const { data: pastOrderData } = useQuery({
    queryKey: ["past-order", focusedOrder],
    // enabled รับประกันว่า queryFn จะไม่ถูกเรียกตอน focusedOrder เป็น undefined
    // แต่ TypeScript มองความสัมพันธ์นี้ไม่เห็น ! จึงสมเหตุสมผลตรงนี้
    queryFn: () => getPastOrder(focusedOrder!),
    enabled: !!focusedOrder,
    staleTime: 24 * 60 * 60 * 1000, // one day in milliseconds
  });

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
