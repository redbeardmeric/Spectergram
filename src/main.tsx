// import { StrictMode } from 'react'
// import ReactDOM from 'react-dom/client'
// import {
//   Outlet,
//   RouterProvider,
//   createRootRoute,
//   createRoute,
//   createRouter,
// } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// import './styles.css'
// import reportWebVitals from './reportWebVitals.ts'

// import App from './App.tsx'

// const rootRoute = createRootRoute({
//   component: () => (
//     <>
//       <Outlet />
//       <TanStackRouterDevtools />
//     </>
//   ),
// })

// const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/',
//   component: App,
// })

// const routeTree = rootRoute.addChildren([indexRoute])

// const router = createRouter({
//   routeTree,
//   context: {},
//   defaultPreload: 'intent',
//   scrollRestoration: true,
//   defaultStructuralSharing: true,
//   defaultPreloadStaleTime: 0,
// })

// declare module '@tanstack/react-router' {
//   interface Register {
//     router: typeof router
//   }
// }

// const rootElement = document.getElementById('app')
// if (rootElement && !rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement)
//   root.render(
//     <StrictMode>
//       <RouterProvider router={router} />
//     </StrictMode>,
//   )
// }

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()


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

// ✅ Import all routes from routes.tsx
import {
  rootRoute,
  indexRoute,
  loginRoute,
  signupRoute,
  friendsRoute,
  chatRoute,
} from "./routes.tsx";

// ✅ Build the complete route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  friendsRoute,
  chatRoute,
]);

// ✅ Router configuration
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// ✅ Register router type
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

// ✅ Keep performance monitoring
reportWebVitals();
