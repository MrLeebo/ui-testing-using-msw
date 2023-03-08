import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { server } from "./server";
import QueryProvider from "~/core/QueryProvider";
import IndexPage from "~/routes/index";

describe("UsersPage", () => {
  it("fetches and displays a list of users", async () => {
    // add a mock handler for a route that our test is going to try to fetch
    server.use(
      rest.get("*/api/users", (req, res, ctx) => {
        return res(
          ctx.json([
            {
              id: 10,
              username: "chana",
              role: "lead chess enthusiast",
              avatarUrl: "fake.jpg",
            },
          ])
        );
      })
    );

    // render the component under test
    render(
      <QueryProvider>
        <IndexPage />
      </QueryProvider>
    );

    // verify that the mock data was returned
    const item = await screen.findByRole("listitem", { name: "chana" });
    expect(item).toBeInTheDocument();
  });
});
