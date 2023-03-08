import { json } from "@remix-run/node";
import { faker } from "@faker-js/faker";

export interface User {
  id: number;
  username: string;
  role: string;
  avatarUrl: string;
}

// This is the "real" user list, without any MSW mocking applied to it.
const data = [
  {
    id: 1,
    username: "emmy",
    role: "head meeting organizer",
    avatarUrl: faker.internet.avatar(),
  },
  {
    id: 2,
    username: "kali",
    role: "chief ping-pong champion",
    avatarUrl: faker.internet.avatar(),
  },
  {
    id: 3,
    username: "jug",
    role: "director of direction",
    avatarUrl: faker.internet.avatar(),
  },
  {
    id: 4,
    username: "leebo",
    role: "senior key pounder",
    avatarUrl: faker.internet.avatar(),
  },
] satisfies User[];

// The API endpoint, returns a list of users.
// GET /api/users
export const loader = () => json(data);
