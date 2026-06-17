import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import PostDetailsButtons from "./PostDetailsButtons";

import { sendRequest } from "../../../../utils/http";

const defaultProps = {
  postId: "1",
  token: "token",
};
const addToastMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});
vi.mock("../../../../utils/http", () => ({
  sendRequest: vi.fn().mockResolvedValue(null),
}));
vi.mock("../../../shared/hooks/useToast", () => ({
  default: () => ({
    addToast: addToastMock,
  }),
}));
const mockedSendRequest = vi.mocked(sendRequest);

describe("Post Details Buttons", () => {
  it("Render correct with correct link", () => {
    RenderWithProviders(<PostDetailsButtons {...defaultProps} />);
    expect(screen.getByRole("link", { name: /edit post/i })).toHaveAttribute(
      "href",
      `/posts/edit/${defaultProps.postId}`,
    );
  });
  it("Sends proper delete request", async () => {
    RenderWithProviders(<PostDetailsButtons {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: /delete post/i }));
    expect(mockedSendRequest).toHaveBeenCalledExactlyOnceWith(
      `/api/posts/${defaultProps.postId}`,
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${defaultProps.token}`,
        },
      }),
    );
  });
  it("Disables button while deleting", async () => {
    mockedSendRequest.mockImplementationOnce(() => new Promise(() => {}));
    RenderWithProviders(<PostDetailsButtons {...defaultProps} />);
    const deleteButton = screen.getByRole("button", { name: /delete post/i });
    await userEvent.click(deleteButton);
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveTextContent(/deleting.../i);
  });

  it("Change page and add toast on success", async () => {
    RenderWithProviders(<PostDetailsButtons {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: /delete post/i }));
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledExactlyOnceWith(
        "Post deleted",
        "success",
      ),
    );
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith("/", {
        replace: true,
      }),
    );
  });

  it("Add toast on error", async () => {
    const errorMsg = "error";
    mockedSendRequest.mockRejectedValueOnce(new Error(errorMsg));
    RenderWithProviders(<PostDetailsButtons {...defaultProps} />);
    await userEvent.click(screen.getByRole("button", { name: /delete post/i }));
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledExactlyOnceWith(errorMsg, "error"),
    );
  });
});
