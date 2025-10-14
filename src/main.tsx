

// import { StrictMode } from "react";
// import ReactDOM from "react-dom/client";
// import {
//   Outlet,
//   RouterProvider,
//   createRootRoute,
//   createRoute,
//   createRouter,
// } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// import "./styles.css";
// import reportWebVitals from "./reportWebVitals.ts";
// import App from "./App.tsx";
// import AuthPage from "./pages/AuthPage.tsx"; // ✅ import your AuthPage component

// // 🧭 1. Root layout route
// const rootRoute = createRootRoute({
//   component: () => (
//     <>
//       <Outlet />
//       <TanStackRouterDevtools />
//     </>
//   ),
// });

// // 🏠 2. Home (Chat / Default) route
// const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/",
//   component: App,
// });

// // 🔐 3. Auth (Login / Signup) route
// const authRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/auth",
//   component: AuthPage,
// });

// // 🗺️ 4. Add both routes to the tree
// const routeTree = rootRoute.addChildren([indexRoute, authRoute]);

// // 🚦 5. Create and configure the router
// const router = createRouter({
//   routeTree,
//   context: {},
//   defaultPreload: "intent",
//   scrollRestoration: true,
//   defaultStructuralSharing: true,
//   defaultPreloadStaleTime: 0,
// });

// // 🧩 6. TanStack type registration
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

// // 🖥️ 7. Render the app
// const rootElement = document.getElementById("app");
// if (rootElement && !rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <StrictMode>
//       <RouterProvider router={router} />
//     </StrictMode>
//   );
// }

// // 📊 8. Performance logging (optional)
// reportWebVitals();


import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

import App from "./App.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import Header from "./Header.tsx"; // ✅ Added header import

// 🧭 1. Root layout route (includes header and devtools)
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header /> {/* ✅ Shows header at the top */}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

// 🏠 2. Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

// 🔐 3. Auth route (Sign In / Sign Up)
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

// 🗺️ 4. Register routes in tree
const routeTree = rootRoute.addChildren([indexRoute, authRoute]);

// 🚦 5. Create router
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// 🧩 6. Type registration for TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// 🖥️ 7. Render application
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

// 📊 8. Performance monitoring (optional)
reportWebVitals();
