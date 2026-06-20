import { sendRequest } from "./http";

const mockedFetch = vi.fn().mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => ({ id: "1" }),
});

describe("Http helper", () => {
  it("Return valid data when response is ok", async () => {
    globalThis.fetch = mockedFetch;
    const result = await sendRequest("", {});
    expect(mockedFetch).toHaveBeenCalledWith(import.meta.env.VITE_API_URL, {});
    expect(result).toEqual({ id: "1" });
  });
  it("Return null when for status code 204", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await sendRequest("", {});
    expect(result).toBeNull();
  });
  it("Throw error with message from response", async () => {
    const errorMsg = "error";
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: errorMsg }),
    });

    await expect(sendRequest("", {})).rejects.toThrow(errorMsg);
  });
  it("Throw error without message from response", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(sendRequest("", {})).rejects.toThrow("Something went wrong!");
  });
  it("Logs error details", async () => {
    const errorDetails = "error details";
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementationOnce(() => {});
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ details: errorDetails }),
    });

    await expect(sendRequest("", {})).rejects.toThrow("Something went wrong!");
    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(errorDetails);
  });
});
