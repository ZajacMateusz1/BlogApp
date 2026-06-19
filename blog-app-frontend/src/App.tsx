import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import router from "./router/router";
import AuthContextProvider from "./modules/auth/store/AuthContextProvider/AuthContextProvider";
import ToastContextProvider from "./modules/shared/store/toast/ToastContextProvider/ToastContextProvider";
function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContextProvider>
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </ToastContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
