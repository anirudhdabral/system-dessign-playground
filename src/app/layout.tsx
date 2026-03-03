"use client";

import "./globals.css";
import { apolloClient } from "@/lib/apolloClient";
import AppThemeProvider from "@/providers/AppThemeProvider";
import ToastProvider from "@/providers/ToastProvider";
import { ApolloProvider } from "@apollo/client/react";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReactFlowProvider } from "reactflow";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <SessionProvider>
          <ReactFlowProvider>
            <ApolloProvider client={apolloClient}>
              <AppThemeProvider>
                <ToastProvider>
                  <Navbar />
                  {children}
                </ToastProvider>
              </AppThemeProvider>
            </ApolloProvider>
          </ReactFlowProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
