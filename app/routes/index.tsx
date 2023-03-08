import { ClientOnly } from "remix-utils";
import UserList from "~/core/UserList";

export default function Index() {
  return (
    <main className="grid h-full place-items-center">
      <div className="w-full md:max-w-lg">
        {/* 
          By default this component would be server rendered, but it doesn't do
          any good to server-render this for the purposes of showcasing MSW
          running in the browser, so let's force this to be a client-rendered
          component.
        */}
        <ClientOnly fallback="Loading...">{() => <UserList />}</ClientOnly>
      </div>
    </main>
  );
}
