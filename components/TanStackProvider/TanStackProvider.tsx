"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function TanStackProvider({ children }: Props) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}