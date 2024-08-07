import { describe, it, expect } from "vitest";
import { createRequest, createResponse, createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";
import { POST } from "../../../app/api/v1/document-groups/route";

export type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type APiResponse = NextApiResponse & ReturnType<typeof createResponse>;

describe("/api/posts", () => {
  it("responds 201 OK for valid POST request", async () => {
    const requestObj = {
      json: async () => ({ name: "Item 3" }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toEqual(201);
    expect(body).toEqual({ id: expect.any(String) });
  });

  it("responds 400 for invalid POST request", async () => {
    const requestObj = {
      json: async () => ({ name: true }),
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      status: 400,
      issues: {
        issues: [
          {
            code: "invalid_type",
            expected: "string",
            received: "boolean",
            path: ["name"],
            message: "Expected string, received boolean",
          },
        ],
        name: "ZodError",
      },
    });
  });

  it("responds 400 for a POST request with a text body", async () => {
    const requestObj = {
      //json: async () => ({ name: true }),
      text: async () => "jeff",
    } as any;

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      status: 400,
      issues: ["TypeError: request.json is not a function"],
    });
  });
});
