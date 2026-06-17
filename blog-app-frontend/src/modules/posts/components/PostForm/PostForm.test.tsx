import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import PostForm from "./PostForm";
import useAuth from "../../../auth/hooks/useAuth";

import { sendRequest } from "../../../../utils/http";

const defaultProps = {
  postData: undefined,
  requestLink: "/",
  submitButtonText: "Submit",
  formTitle: "Title",
  cancelLink: "/",
};
const defaultPostData = {
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
vi.mock("../../../../utils/http", () => ({ sendRequest: vi.fn() }));
const mockedUseAuth = vi.mocked(useAuth);
const mockedSendRequest = vi.mocked(sendRequest);

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

  it("Sends auth token", async () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    const title = screen.getByRole("textbox", { name: /title/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    expect(mockedSendRequest).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer token",
        },
      }),
    );
  });

  it("Does not send request with empty fields and renders errors", async () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);
    expect(mockedSendRequest).not.toHaveBeenCalled();
    expect(screen.getByText(/Min title length is 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select file/i)).toBeInTheDocument();
  });

  it("Sends POST request in create mode", async () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    const title = screen.getByRole("textbox", { name: /title/i });
    const description = screen.getByRole("textbox", { name: /description/i });
    const image = screen.getByLabelText(/pick image/i);
    await userEvent.type(title, "Title");
    await userEvent.type(description, "description");
    await userEvent.upload(
      image,
      new File(["image"], "image.png", { type: "image/png" }),
    );
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    expect(mockedSendRequest).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("Sends proper data in create mode", async () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    const file = new File(["image"], "image.png", { type: "image/png" });
    const submitButton = screen.getByRole("button", { name: /submit/i });
    const title = screen.getByRole("textbox", { name: /title/i });
    const description = screen.getByRole("textbox", { name: /description/i });
    const image = screen.getByLabelText(/pick image/i);
    await userEvent.type(title, "Title");
    await userEvent.type(description, "Description");
    await userEvent.upload(image, file);
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    const [, options] = mockedSendRequest.mock.calls[0];
    const formData = options.body as FormData;
    expect(formData.get("title")).toBe("Title");
    expect(formData.get("description")).toBe("Description");
    expect(formData.get("image")).toBe(file);
  });

  it("Fills form with post data in edit mode", () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
      "Title",
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      "Description",
    );
  });

  it("Sends PATCH request in edit mode", async () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    const title = screen.getByRole("textbox", { name: /title/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    expect(mockedSendRequest).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
  });

  it("Does not send unchanged fields", async () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    const title = screen.getByRole("textbox", { name: /title/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.clear(title);
    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    const [, options] = mockedSendRequest.mock.calls[0];
    const formData = options.body as FormData;
    expect(formData.get("title")).toBe("New Title");
    expect(formData.has("description")).toBe(false);
    expect(formData.has("image")).toBe(false);
  });

  it("Does not send request when no fields were changed and renders error", async () => {
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);
    expect(mockedSendRequest).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: /You must provide changes!/i }),
    ).toBeInTheDocument();
  });
});
