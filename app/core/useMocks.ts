import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { rest, setupWorker, type RestHandler } from "msw";
import { faker } from "@faker-js/faker";
import type { User } from "~/routes/api.users";
import henry from "./henry.png";

export default function useMocks() {
  // True when the MSW worker is running.
  const [isRunning, setIsRunning] = useState(false);

  // If the mocks change, we're going to clear the query cache so that any
  // data that has already been fetched can be retrieved under the new rules.
  const queryClient = useQueryClient();

  // Activate mock handlers by including a query parameter in the URL.
  const searchParams = new URLSearchParams(location.search);
  const willMockData = searchParams.get("mockData") === "true";
  const willMockAvatars = searchParams.get("mockAvatars") === "true";

  useEffect(() => {
    // Only allow mocks if the server permits them.
    if (window.ENV.MOCK !== "true") return;

    // Mock the user list results
    const dataHandlers = [
      rest.get("*/api/users", (req, res, ctx) => {
        const mockUsers = [
          {
            id: 100,
            username: "william",
            role: "lead snack requisitions officer",
            avatarUrl: faker.internet.avatar(),
          },
          {
            id: 101,
            username: "chris",
            role: "code wizard",
            avatarUrl: faker.internet.avatar(),
          },
          {
            id: 102,
            username: "alina",
            role: "head of buzzword compliance",
            avatarUrl: faker.internet.avatar(),
          },
        ] satisfies User[];

        return res(ctx.json(mockUsers));
      }),
    ] satisfies RestHandler[];

    // Replace the avatar image with a local file
    const cloudflareIpfsHandlers = [
      rest.get(
        "https://cloudflare-ipfs.com/ipfs/:ipfsId/avatar/:avatarId.jpg",
        async (req, res, ctx) => {
          const imgRes = await fetch(henry);
          const buffer = await imgRes.arrayBuffer();
          return res(
            ctx.set({
              "Content-Type": "image/png",
              "Content-Length": String(buffer.byteLength),
            }),
            ctx.body(buffer)
          );
        }
      ),
    ] satisfies RestHandler[];

    // Include/exclude mock handlers based on which query string parameters the
    // browser has added: e.g. ?mockData=true&mockAvatars=false
    const worker = setupWorker(
      ...(willMockData ? dataHandlers : []),
      ...(willMockAvatars ? cloudflareIpfsHandlers : [])
    );

    // Begin mocking requests
    worker.start({ onUnhandledRequest: "bypass" }).then(() => {
      queryClient.clear();
      setIsRunning(true);
      console.info("🔶 Mock server running");
      worker.printHandlers();
    });

    // Cleanup function
    return () => {
      worker.stop();
      setIsRunning(false);
      console.info("🔶 Mock server stopped");
    };
  }, [queryClient, willMockData, willMockAvatars]);

  return isRunning;
}
