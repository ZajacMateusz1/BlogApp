import { screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import RenderWithProviders from "../../../../utils/tests/RenderWithProviders";
import EditPostPage from "./EditPostPage";

import { sendRequest } from "../../../../utils/http";

vi.mock("../../../auth/hooks/useAuth", () => ({
  default: () => ({
    token: "token",
    userId: "1",
    handleLogin: () => {},
    handleLogout: () => {},
  }),
}));
vi.mock("../../../../utils/http", () => ({
  sendRequest: vi.fn().mockResolvedValue({ creator: { id: "1" } }),
}));

const mockedSendRequest = vi.mocked(sendRequest);

describe("Edit Post Page", () => {
  it("Renders loading spinner while fetching", () => {
    mockedSendRequest.mockImplementationOnce(() => new Promise(() => {}));
    RenderWithProviders(<EditPostPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("Renders error message when the request fails", async () => {
    const errorMsg = "error";
    mockedSendRequest.mockRejectedValueOnce(new Error(errorMsg));
    RenderWithProviders(<EditPostPage />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: `${errorMsg}` }),
      ).toBeInTheDocument(),
    );
  });

  it("Renders form when userId is creator id", async () => {
    RenderWithProviders(<EditPostPage />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /edit post/i }),
      ).toBeInTheDocument(),
    );
  });

  it("Change page when userId is not creatorId", async () => {
    mockedSendRequest.mockResolvedValueOnce({ creator: { id: "2" } });
    RenderWithProviders(
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/posts/edit/:postId" element={<EditPostPage />} />
      </Routes>,
      ["/posts/edit/2"],
    );
    await waitFor(() =>
      expect(screen.getByText(/home page/i)).toBeInTheDocument(),
    );
  });
});
