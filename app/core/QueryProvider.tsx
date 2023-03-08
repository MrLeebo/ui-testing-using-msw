import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        // fetch polyfills don't support relative urls, so provide a stand-in
        // for the base URL
        const host = global.ENV.NODE_ENV === "test" ? "http://example.com" : "";
        const res = await fetch(`${host}${queryKey[0]}`);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      },
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryProvider(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
