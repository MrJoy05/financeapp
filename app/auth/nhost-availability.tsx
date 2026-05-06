"use client";

import { createContext, useContext } from "react";

const Ctx = createContext(false);

export function NhostConfiguredBoundary({
  configured,
  children,
}: {
  configured: boolean;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={configured}>{children}</Ctx.Provider>;
}

export function useNhostConfigured(): boolean {
  return useContext(Ctx);
}
