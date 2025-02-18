"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryclient = new QueryClient();

  return (
    <QueryClientProvider client={queryclient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};
export default Providers;
