import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import AuthContextProvider from "./modules/auth/store/AuthContextProvider";
function App() {
  return (
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  );
}

export default App;
