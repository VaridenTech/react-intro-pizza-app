import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import Pizza from "../Pizza";

test("alt text renders on image", async () => {
  const name = "My Favorite Pizza";
  const src = "https://picsum.photos/200";
  // render ของ vitest-browser-react คืน Promise จึงต้อง await
  const screen = await render(
    <Pizza name={name} description="super cool pizza" image={src} />,
  );

  const img = screen.getByRole("img");

  // ใช้ toHaveAttribute จึงไม่ต้อง cast เป็น HTMLImageElement เหมือนเวอร์ชัน happy-dom
  await expect.element(img).toBeInTheDocument();
  await expect.element(img).toHaveAttribute("src", src);
  await expect.element(img).toHaveAttribute("alt", name);
});
