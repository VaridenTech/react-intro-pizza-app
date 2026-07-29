// delete the React import
import { createRoot } from "react-dom/client";
import Order from "./Order";

// delete the Pizza component

const App = () => {
  return (
    <div>
      <h1>Pizza app – Order Now</h1>
      <Order />
    </div>
  );
};

const container = document.getElementById("root");
if (!container) {
  throw new Error("ไม่พบ element ที่มี id=\"root\" ใน index.html");
}
const root = createRoot(container);
root.render(<App />);