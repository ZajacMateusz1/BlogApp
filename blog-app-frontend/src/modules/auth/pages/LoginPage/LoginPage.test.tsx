import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import LoginPage from "./LoginPage";
import { sendRequest } from "../../../../utils/http";

import type { AuthResponseType } from "../../types/auth-types";
import type { LoginSchemaType } from "../../schemas/auth-schema";

const defaultData: LoginSchemaType = {
  email: "email@email.com",
  password: "Password123",
};
const defaultResponse = vi.hoisted<AuthResponseType>(() => ({
  token: "token",
  id: "1",
  email: "",
}));

const fillAndSubmit = async () => {
  await userEvent.type(
    screen.getByRole("textbox", { name: /email/i }),
    defaultData.email,
  );
  await userEvent.type(
    screen.getByLabelText(/password/i),
    defaultData.password,
  );
  await userEvent.click(screen.getByRole("button", { name: /log in/i }));
};

const mockedHandleLogin = vi.fn();
const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});
vi.mock("../../hooks/useAuth", () => ({
  default: () => ({
    handleLogin: mockedHandleLogin,
  }),
}));
vi.mock("../../../../utils/http", () => ({
  sendRequest: vi.fn().mockResolvedValue(defaultResponse),
}));
const mockedSendRequest = vi.mocked(sendRequest);

describe("Login Page", () => {
  it("Shows validation errors", async () => {
    RenderWithProviders(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/min password length is/i)).toBeInTheDocument();
    expect(mockedSendRequest).not.toHaveBeenCalled();
  });

  it("Sends correct request", async () => {
    RenderWithProviders(<LoginPage />);
    await fillAndSubmit();

    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: defaultData.email,
          password: defaultData.password,
        }),
      }),
    );
  });

  it("Shows backend errors", async () => {
    const errorMsg = "error";
    mockedSendRequest.mockRejectedValueOnce(new Error(errorMsg));
    RenderWithProviders(<LoginPage />);
    await fillAndSubmit();

    expect(await screen.findByText(errorMsg)).toBeInTheDocument();
  });

  it("Calls handleLogin and navigates to home page after successful login", async () => {
    RenderWithProviders(<LoginPage />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockedHandleLogin).toHaveBeenCalledExactlyOnceWith(
        defaultResponse.token,
        defaultResponse.id,
      );
      expect(mockedNavigate).toHaveBeenCalledExactlyOnceWith("/");
    });
  });
});
