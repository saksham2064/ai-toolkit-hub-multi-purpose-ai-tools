"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
