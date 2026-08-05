import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import router from "./router/router";
import AuthContextProvider from "./modules/auth/store/AuthContextProvider/AuthContextProvider";
import ToastContextProvider from "./modules/shared/store/toast/ToastContextProvider/ToastContextProvider";
import WsContextProvider from "./modules/ws/store/WsContextProvider";
const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContextProvider>
          <AuthContextProvider>
            <WsContextProvider>
              <RouterProvider router={router} />
            </WsContextProvider>
          </AuthContextProvider>
        </ToastContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
