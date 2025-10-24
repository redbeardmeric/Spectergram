import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/msalConfig";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Import routes
import {
	rootRoute,
	indexRoute,
	loginRoute,
	signupRoute,
	dashboardRoute,
} from "./routes.tsx";

//  Build the complete route tree
const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	signupRoute,
	dashboardRoute,
]);

//  Create router
const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

//  Register router type
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
				<MsalProvider instance={msalInstance}>
					<RouterProvider router={router} />
				</MsalProvider>
			</StrictMode>,
	);
}

// Performance metrics (optional)
reportWebVitals();
