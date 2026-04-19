import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../shared/layouts/RootLayout";
import ErrorPage from "../shared/pages/ErrorPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import LoginPage from "../modules/auth/pages/LoginPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
      },
      { path: "register", element: <RegisterPage /> },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
export default router;
