import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../modules/shared/layouts/RootLayout";
import ErrorPage from "../modules/shared/pages/ErrorPage";
import AuthLayout from "../modules/auth/pages/AuthLayout";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import LoginPage from "../modules/auth/pages/LoginPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "register", element: <RegisterPage /> },
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        index: true,
      },
    ],
  },
]);
export default router;
