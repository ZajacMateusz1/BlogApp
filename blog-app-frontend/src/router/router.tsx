import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../modules/shared/layouts/RootLayout";
import ErrorPage from "../modules/shared/pages/ErrorPage";
import GuestLayout from "../modules/shared/layouts/GuestLayout";
// import ProtectedLayout from "../modules/shared/layouts/ProtectedLayout";

import RegisterPage from "../modules/auth/pages/RegisterPage";
import LoginPage from "../modules/auth/pages/LoginPage";

import PostDetailsPage from "../modules/posts/pages/PostDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          { path: "register", element: <RegisterPage /> },
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "posts",
        children: [
          {
            path: ":postId",
            element: <PostDetailsPage />,
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
