import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import PostForm from "./PostForm";

import { sendRequest } from "../../../../utils/http/http";

import type { PostResponseType } from "../../types/posts-types";

const defaultProps = {
  postData: undefined,
  requestLink: "/",
  submitButtonText: "Submit",
  formTitle: "Title",
  cancelLink: "/",
};
const defaultPostData: PostResponseType = {
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
  likesCount: 0,
  isLiked: false,
  commentsCount: 0,
};

const getFormElements = () => ({
  submitButton: screen.getByRole("button", { name: /submit/i }),
  title: screen.getByRole("textbox", { name: /title/i }),
  description: screen.getByRole("textbox", { name: /description/i }),
  image: screen.getByLabelText(/pick image/i),
});

vi.mock("../../../auth/hooks/useAuth", () => ({
  default: () => ({
    token: "token",
    userId: "1",
    handleLogin: () => {},
    handleLogout: () => {},
  }),
}));
vi.mock("../../../../utils/http/http", () => ({ sendRequest: vi.fn() }));

const mockedSendRequest = vi.mocked(sendRequest);

describe("Post From", () => {
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
    const { submitButton, title } = getFormElements();

    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
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
    const { submitButton } = getFormElements();

    await userEvent.click(submitButton);
    expect(mockedSendRequest).not.toHaveBeenCalled();
    expect(screen.getByText(/Min title length is 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select file/i)).toBeInTheDocument();
  });

  it("Sends POST request in create mode", async () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    const { submitButton, title, description, image } = getFormElements();

    await userEvent.type(title, "Title");
    await userEvent.type(description, "description");
    await userEvent.upload(
      image,
      new File(["image"], "image.png", { type: "image/png" }),
    );
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
      "/",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("Sends proper data in create mode", async () => {
    RenderWithProviders(<PostForm {...defaultProps} />);
    const { submitButton, title, description, image } = getFormElements();

    const file = new File(["image"], "image.png", { type: "image/png" });
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
    const { submitButton, title } = getFormElements();

    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
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
    const { submitButton, title } = getFormElements();

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
    const { submitButton } = getFormElements();

    await userEvent.click(submitButton);
    expect(mockedSendRequest).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: /You must provide changes!/i }),
    ).toBeInTheDocument();
  });

  it("Disables button while sending request", async () => {
    mockedSendRequest.mockImplementation(() => new Promise(() => {}));
    RenderWithProviders(
      <PostForm {...defaultProps} postData={defaultPostData} />,
    );
    const { submitButton, title } = getFormElements();

    await userEvent.type(title, "New Title");
    await userEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/submitting.../i);
  });
});
