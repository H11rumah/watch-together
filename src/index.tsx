import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainPage from "./pages/MainPage";
import PlayerPage from "./pages/PlayerPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <MainPage />,
            },
            {
                path: "/:roomId",
                element: <PlayerPage />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
