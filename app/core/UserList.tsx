import { useQuery } from "react-query";
import useMocks from "~/core/useMocks";
import type { User } from "~/routes/api.users";

export default function UserList() {
  // These mocks probably wouldn't be hooked up in the same component that
  // is fetching this data, but I didn't really feel like building out a larger
  // component graph just to make this set-up look more realistic.
  //
  // As long as you wire up your mocks before the thing they're fetching gets
  // picked up, you're alright.
  useMocks();

  // This is the data fetch which can be replaced with a mock.
  const { data = [] } = useQuery<User[]>("/api/users");

  // Render the list of users we fetched.
  return (
    <>
      <h1 className="mb-4 text-xl font-semibold text-gray-700">Users</h1>
      <ul className="flex list-none flex-col gap-4">
        {data
          ? data.map((user) => (
              <li
                key={user.id}
                aria-label={user.username}
                className="flex items-center gap-4 p-3 shadow-md"
              >
                <img
                  src={user.avatarUrl}
                  className="h-16 w-16 rounded-full outline outline-gray-100"
                  alt=""
                />
                <div>
                  <p className="text-lg">{user.username}</p>
                  <p className="text-gray-400">{user.role}</p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </>
  );
}
