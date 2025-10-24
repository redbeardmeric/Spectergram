// src/routes.tsx
import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import App from "./App.tsx";
import LoginUI from "./ui/LoginUI.tsx";
import SignupUI from "./ui/SignupUI.tsx";
import FriendListUI from "./ui/FriendListUI.tsx";
import ChatUI from "./ui/ChatUI.tsx";
import ChatDashboard from "./ui/ChatDashboard.tsx";

export const rootRoute = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});

// main (home) route
export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: App,
});

// login route
export const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginUI,
});

// signup route
export const signupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/signup",
	component: SignupUI,
});

// friend list route
export const friendsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/friends",
	component: FriendListUI,
});

// chat route
export const chatRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	component: ChatUI,
});

export const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	component: ChatDashboard,
});
