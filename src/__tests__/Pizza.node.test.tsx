import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Pizza from "../Pizza";

afterEach(cleanup);

test("alt text renders on image", async () => {
  const name = "My Favorite Pizza";
  const src = "https://picsum.photos/200";
  const screen = render(
    <Pizza name={name} description="super cool pizza" image={src} />,
  );

  // getByRole คืน HTMLElement กลาง ๆ ที่ไม่มี src/alt จึงต้องบอก type ให้ชัด
  const img = screen.getByRole("img") as HTMLImageElement;
  expect(img.src).toBe(src);
  expect(img.alt).toBe(name);
});

test("to have default image if none is provided", async () => {
  const screen = render(
    <Pizza name={"Cool Pizza"} description="super cool pizza" />,
  );

  const img = screen.getByRole("img") as HTMLImageElement;
  expect(img.src).not.toBe("");
});
