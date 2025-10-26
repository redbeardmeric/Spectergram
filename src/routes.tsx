// src/routes.tsx
import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Lazy load devtools only in development
const TanStackRouterDevtools =
	import.meta.env.MODE === "production"
		? () => null
		: lazy(() =>
				import("@tanstack/react-router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
				})),
			);

// Lazy load all route components for code splitting
const App = lazy(() => import("./App.tsx"));
const LoginUI = lazy(() => import("./ui/LoginUI.tsx"));
const SignupUI = lazy(() => import("./ui/SignupUI.tsx"));
const FriendListUI = lazy(() => import("./ui/FriendListUI.tsx"));
const ChatUI = lazy(() => import("./ui/ChatUI.tsx"));
const ChatDashboard = lazy(() => import("./ui/ChatDashboard.tsx"));

export const rootRoute = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<Suspense fallback={null}>
				<TanStackRouterDevtools />
			</Suspense>
		</>
	),
});

// main (home) route
export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<App />
		</Suspense>
	),
});

// login route
export const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<LoginUI />
		</Suspense>
	),
});

// signup route
export const signupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/signup",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<SignupUI />
		</Suspense>
	),
});

// friend list route
export const friendsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/friends",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<FriendListUI />
		</Suspense>
	),
});

// chat route
export const chatRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<ChatUI />
		</Suspense>
	),
});

export const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	component: () => (
		<Suspense fallback={<div>Loading...</div>}>
			<ChatDashboard />
		</Suspense>
	),
});
