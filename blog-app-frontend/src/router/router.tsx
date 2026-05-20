import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../modules/shared/layouts/RootLayout";
import ErrorPage from "../modules/shared/pages/ErrorPage";
import GuestLayout from "../modules/shared/layouts/GuestLayout";
import ProtectedLayout from "../modules/shared/layouts/ProtectedLayout";

import RegisterPage from "../modules/auth/pages/RegisterPage";
import LoginPage from "../modules/auth/pages/LoginPage";

import PostDetailsPage from "../modules/posts/pages/PostDetailsPage";
import CreatePostPage from "../modules/posts/pages/CreatePostPage";
import EditPostPage from "../modules/posts/pages/EditPostPage";

const router = createBrowserRouter([
  {
    path: "/",
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
        element: <ProtectedLayout />,
        children: [
          {
            element: <RootLayout />,

            children: [
              {
                index: true,
              },
              {
                path: "posts",
                children: [
                  {
                    path: "create",
                    element: <CreatePostPage />,
                  },
                  {
                    path: "edit/:postId",
                    element: <EditPostPage />,
                  },
                  {
                    path: ":postId",
                    element: <PostDetailsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
