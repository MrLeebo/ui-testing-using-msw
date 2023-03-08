import { beforeAll, afterAll, afterEach } from "vitest";
import { installGlobals } from "@remix-run/node";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "~/tests/server";
import { getEnv } from "~/env.server";

global.ENV = getEnv();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterEach(cleanup);
afterAll(() => server.close());

installGlobals();
