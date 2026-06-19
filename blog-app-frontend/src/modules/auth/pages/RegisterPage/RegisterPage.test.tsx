import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import RegisterPage from "./RegisterPage";

import { sendRequest } from "../../../../utils/http";

import type { RegisterSchemaType } from "../../schemas/auth-schema";
import type { AuthResponseType } from "../../types/auth-types";

const defaultData: RegisterSchemaType = {
  email: "email@email.com",
  username: "username",
  password: "Password123",
  repeatPassword: "Password123",
};

const defaultResponse = vi.hoisted<AuthResponseType>(() => ({
  token: "token",
  id: "1",
  email: "",
}));

const fillAndSubmit = async (repeatPassword?: true) => {
  await userEvent.type(
    screen.getByRole("textbox", { name: /email/i }),
    defaultData.email,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: /username/i }),
    defaultData.username,
  );
  await userEvent.type(
    screen.getByLabelText(/^password/i),
    defaultData.password,
  );
  await userEvent.type(
    screen.getByLabelText(/^repeat password/i),
    repeatPassword
      ? defaultData.repeatPassword + "1"
      : defaultData.repeatPassword,
  );
  await userEvent.click(screen.getByRole("button", { name: /register/i }));
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

describe("Register Page", () => {
  it("Shows validation errors for empty fields", async () => {
    RenderWithProviders(<RegisterPage />);
    await userEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/min username length is/i)).toBeInTheDocument();
    expect(screen.getAllByText(/min password length is /i)).toHaveLength(2);
    expect(mockedSendRequest).not.toHaveBeenCalled();
  });

  it("Shows error when passwords do not match", async () => {
    RenderWithProviders(<RegisterPage />);
    await fillAndSubmit(true);
    expect(screen.getByText(/passwords are not the same/i)).toBeInTheDocument();
    expect(mockedSendRequest).not.toHaveBeenCalled();
  });

  it("Sends correct request", async () => {
    RenderWithProviders(<RegisterPage />);
    await fillAndSubmit();

    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: defaultData.email,
          password: defaultData.password,
          username: defaultData.username,
          repeatPassword: defaultData.repeatPassword,
        }),
      }),
    );
  });

  it("Shows backend errors", async () => {
    const errorMsg = "error";
    mockedSendRequest.mockRejectedValueOnce(new Error(errorMsg));
    RenderWithProviders(<RegisterPage />);
    await fillAndSubmit();

    expect(await screen.findByText(errorMsg)).toBeInTheDocument();
  });

  it("Calls handleLogin and navigates to home page after successful request", async () => {
    RenderWithProviders(<RegisterPage />);
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
