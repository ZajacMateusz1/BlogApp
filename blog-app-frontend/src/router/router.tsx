import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../modules/shared/layouts/RootLayout";
import ErrorPage from "../modules/shared/pages/ErrorPage";
import GuestLayout from "../modules/shared/layouts/GuestLayout";
import ProtectedLayout from "../modules/shared/layouts/ProtectedLayout";

import RegisterPage from "../modules/auth/pages/RegisterPage/RegisterPage";
import LoginPage from "../modules/auth/pages/LoginPage/LoginPage";

import HomePage from "../modules/home/pages/HomePage";

import PostDetailsPage from "../modules/posts/pages/PostDetailsPage/PostDetailsPage";
import CreatePostPage from "../modules/posts/pages/CreatePostPage";
import EditPostPage from "../modules/posts/pages/EditPostPage/EditPostPage";

import UserDetailsPage from "../modules/users/pages/UserDetailsPage";
import EditUserProfilePage from "../modules/users/pages/EditUserProfilePage";

import NotificationsPage from "../modules/notifications/pages/NotificationsPage";

import ConversationListPage from "../modules/messages/pages/ConversationListPage";
import ActiveConversationPage from "../modules/messages/pages/ActiveConversationPage";

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
                element: <HomePage />,
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
              {
                path: "users",
                children: [
                  {
                    path: "edit-profile",
                    element: <EditUserProfilePage />,
                  },
                  {
                    path: ":userId",
                    element: <UserDetailsPage />,
                  },
                ],
              },
              {
                path: "notifications",
                element: <NotificationsPage />,
              },
              {
                path: "conversations",
                children: [
                  {
                    index: true,
                    element: <ConversationListPage />,
                  },
                  {
                    path: ":conversationId",
                    element: <ActiveConversationPage />,
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
