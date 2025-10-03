// src/jsRoute.js
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routes";

export const jsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/js",
  component: () => <div>Hello from a JS route</div>,
});

