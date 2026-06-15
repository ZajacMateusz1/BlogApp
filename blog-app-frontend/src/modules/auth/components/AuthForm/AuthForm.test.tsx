import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "./AuthForm";
import { MemoryRouter } from "react-router-dom";

const defaultProps = {
  formTitle: "Title",
  isSubmitting: false,
  reset: () => {},
  bottomLink: "/",
  bottomLinkText: "Link",
  rootError: null,
  submitButtonText: "Submit",
};

describe("AuthForm", () => {
  it("Renders given props", () => {
    render(
      <MemoryRouter>
        <AuthForm {...defaultProps}>
          <input type="text" />
        </AuthForm>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
  it("Reset button works", async () => {
    const reset = vi.fn();
    render(
      <MemoryRouter>
        <AuthForm {...defaultProps} reset={reset}>
          <input type="text" />
        </AuthForm>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("Buttons are disabled while submitting", () => {
    render(
      <MemoryRouter>
        <AuthForm {...defaultProps} isSubmitting={true}>
          <input type="text" />
        </AuthForm>
      </MemoryRouter>,
    );

    const buttons = screen.getAllByRole("button", { name: /submitting.../i });
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
