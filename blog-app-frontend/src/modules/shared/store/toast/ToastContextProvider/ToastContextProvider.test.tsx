import type { ReactNode } from "react";
import { screen, renderHook, act } from "@testing-library/react";
import useToast from "../../../hooks/useToast";
import ToastContextProvider from "./ToastContextProvider";

import type { ToastVariants } from "../toast-context";

const TOAST_TIMEOUT = 3001;
const defaultData: { message: string; type: ToastVariants } = {
  message: "msg",
  type: "info",
};

function wrapper({ children }: { children: ReactNode }) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}
const renderUseToast = () => {
  const { result } = renderHook(() => useToast(), { wrapper });
  return result;
};

describe("Toast Context Provider", () => {
  afterEach(() => vi.useRealTimers());

  it("Renders toast", () => {
    const result = renderUseToast();
    act(() => result.current.addToast(defaultData.message, defaultData.type));
    expect(screen.getByText(defaultData.message)).toBeInTheDocument();
  });

  it("Renders multiple toasts", () => {
    const result = renderUseToast();
    act(() => {
      result.current.addToast(defaultData.message, defaultData.type);
      result.current.addToast(defaultData.message, defaultData.type);
    });
    expect(screen.getAllByText(defaultData.message)).toHaveLength(2);
  });

  it("Removes toast after time expire", () => {
    vi.useFakeTimers();
    const result = renderUseToast();
    act(() => result.current.addToast(defaultData.message, defaultData.type));
    expect(screen.getByText(defaultData.message)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(TOAST_TIMEOUT));
    expect(screen.queryByText(defaultData.message)).not.toBeInTheDocument();
  });
});
