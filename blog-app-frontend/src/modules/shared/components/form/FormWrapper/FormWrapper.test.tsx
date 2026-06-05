import { render, screen } from "@testing-library/react";
import FormWrapper from "./FormWrapper";

describe("Form Wrapper", () => {
  it("renders children", () => {
    render(
      <FormWrapper formTitle="Title" rootError={null}>
        <p>Form child</p>
      </FormWrapper>,
    );
    const formChild = screen.getByText("Form child");
    expect(formChild).toBeInTheDocument();
  });
  it("renders root error", () => {
    render(
      <FormWrapper formTitle="Title" rootError="error">
        <p>Form child</p>
      </FormWrapper>,
    );
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
  });
  it("not render root error when rootError is null", () => {
    render(
      <FormWrapper formTitle="Title" rootError={null}>
        <p>Form child</p>
      </FormWrapper>,
    );
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).not.toBeInTheDocument();
  });
});
