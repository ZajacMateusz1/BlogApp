import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";
import router from "./router/router";
import AuthContextProvider from "./modules/auth/store/AuthContextProvider";
import ToastContextProvider from "./modules/shared/store/toast/ToastContextProvider";
function App() {
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
