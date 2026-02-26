import { createBrowserRouter } from "react-router";
import { FlowOverview } from "./components/FlowOverview";
import { BrowseDining } from "./components/BrowseDining";
import { Cart } from "./components/Cart";
import { MyReservations } from "./components/MyReservations";
import { AdminConfig } from "./components/AdminConfig";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FlowOverview,
  },
  {
    path: "/browse",
    Component: BrowseDining,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/reservations",
    Component: MyReservations,
  },
  {
    path: "/admin",
    Component: AdminConfig,
  },
]);
