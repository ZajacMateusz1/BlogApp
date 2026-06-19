import type { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import useAuth from "../../hooks/useAuth";
import AuthContextProvider from "./AuthContextProvider";

const defaultData = {
  token: "token",
  userId: "1",
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
const renderUseAuth = () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  return result;
};

describe("Auth Context Provider", () => {
  afterEach(() => vi.useRealTimers());
  it("Provides initial auth state", () => {
    const result = renderUseAuth();
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
  });

  it("handleLogin works", () => {
    const result = renderUseAuth();
    act(() =>
      result.current.handleLogin(defaultData.token, defaultData.userId),
    );
    expect(result.current.token).toBe(defaultData.token);
    expect(result.current.userId).toBe(defaultData.userId);
    expect(localStorage.getItem("token")).toBe(defaultData.token);
    expect(localStorage.getItem("userId")).toBe(defaultData.userId);
  });

  it("handleLogout works", () => {
    const result = renderUseAuth();
    act(() =>
      result.current.handleLogin(defaultData.token, defaultData.userId),
    );
    act(() => result.current.handleLogout());
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });

  it("Auto logout works", () => {
    vi.useFakeTimers();
    const result = renderUseAuth();
    act(() =>
      result.current.handleLogin(defaultData.token, defaultData.userId),
    );
    expect(result.current.token).toBe(defaultData.token);
    expect(result.current.userId).toBe(defaultData.userId);
    expect(localStorage.getItem("token")).toBe(defaultData.token);
    expect(localStorage.getItem("userId")).toBe(defaultData.userId);
    act(() => vi.runAllTimers());
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });
});
