import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "./PostForm";
import useAuth from "../../../auth/hooks/useAuth";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";

const defaultProps = {
  postData: undefined,
  requestLink: "/",
  submitButtonText: "Submit",
  formTitle: "Title",
  cancelLink: "/",
};
const defaultUserData = {
  id: "1",
  createdAt: "",
  updatedAt: "",
  title: "Title",
  description: "Description",
  image: "",
  creator: {
    id: "",
    username: "",
    avatar: "",
  },
};

const defaultUseAuthValue = {
  token: "token",
  userId: "1",
  handleLogin: () => {},
  handleLogout: () => {},
};

vi.mock("../../../auth/hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuth);

describe("Post From", () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue(defaultUseAuthValue);
  });
  it("Renders given props", () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancel/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
  it("Fills form with post data in edit mode", () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultUserData} />,
    );
    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      "Title",
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      "Description",
    );
  });
});
