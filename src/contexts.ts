import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CartItem } from "./types";

export type CartHook = [CartItem[], Dispatch<SetStateAction<CartItem[]>>];

export const CartContext = createContext<CartHook>([[], () => {}]);
