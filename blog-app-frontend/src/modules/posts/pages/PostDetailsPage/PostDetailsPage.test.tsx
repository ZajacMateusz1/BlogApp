import { screen } from "@testing-library/react";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import PostDetailsPage from "./PostDetailsPage";

import { sendRequest } from "../../../../utils/http";

import type { PostResponseType } from "../../types/posts-types";

const defaultPost = vi.hoisted<PostResponseType>(() => ({
  id: "1",
  title: "Title",
  image: "Image",
  description: "Description",
  creator: {
    id: "1",
    username: "user",
    avatar: "avatar",
  },
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
}));

vi.mock("../../../shared/hooks/useToast", () => ({
  default: () => ({
    addToast: () => {},
  }),
}));
vi.mock("../../../auth/hooks/useAuth", () => ({
  default: () => ({
    token: "token",
    userId: "1",
    handleLogin: () => {},
    handleLogout: () => {},
  }),
}));
vi.mock("../../../../utils/http", () => ({
  sendRequest: vi.fn().mockResolvedValue(defaultPost),
}));
const mockedSendRequest = vi.mocked(sendRequest);

describe("PostDetailsPage", () => {
  it("Renders loading spinner while fetching", () => {
    mockedSendRequest.mockImplementationOnce(() => new Promise(() => {}));
    RenderWithProviders(<PostDetailsPage />);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("Renders error message when the request fails", async () => {
    const errorMsg = "error";
    mockedSendRequest.mockRejectedValueOnce(new Error(errorMsg));
    RenderWithProviders(<PostDetailsPage />);
    expect(mockedSendRequest).toHaveBeenCalledOnce();
    expect(
      await screen.findByRole("heading", { name: `${errorMsg}` }),
    ).toBeInTheDocument();
  });

  it("Renders page content when request succeed", async () => {
    RenderWithProviders(<PostDetailsPage />);

    expect(mockedSendRequest).toHaveBeenCalledOnce();

    const avatar = await screen.findByRole("img", { name: /user avatar/i });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", defaultPost.creator.avatar);
    const userProfileLink = await screen.findByRole("link", {
      name: new RegExp(defaultPost.creator.username, "i"),
    });
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute(
      "href",
      `/users/${defaultPost.creator.id}`,
    );
    const image = await screen.findByRole("img", {
      name: defaultPost.title,
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", defaultPost.image);

    expect(
      await screen.findByRole("heading", { name: defaultPost.title }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(defaultPost.description),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        new Date(defaultPost.createdAt).toLocaleString(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }),
      ),
    ).toBeInTheDocument();
  });

  it("Renders buttons when user is owner", async () => {
    RenderWithProviders(<PostDetailsPage />);

    expect(mockedSendRequest).toHaveBeenCalledOnce();

    expect(
      await screen.findByRole("button", { name: /delete post/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /edit post/i }),
    ).toBeInTheDocument();
  });

  it("Does not renders buttons when user is not owner", async () => {
    mockedSendRequest.mockResolvedValueOnce({
      ...defaultPost,
      creator: {
        id: "2",
        username: "user",
        avatar: "avatar",
      },
    });
    RenderWithProviders(<PostDetailsPage />);

    expect(mockedSendRequest).toHaveBeenCalledOnce();

    await screen.findByRole("heading", { name: defaultPost.title });
    expect(
      screen.queryByRole("button", { name: /delete post/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /edit post/i }),
    ).not.toBeInTheDocument();
  });
});
