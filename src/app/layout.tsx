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

/**
 * Blocking theme script — runs synchronously in <head> before ANY paint.
 *
 * This eliminates the flash of dark/light because:
 *  1. It reads localStorage before React hydrates.
 *  2. Sets data-theme + backgroundColor directly on <html> as inline style
 *     (inline styles beat media queries, so the CSS vars resolve correctly
 *     from the very first frame).
 *  3. Also suppresses CSS transitions for that first frame so there is no
 *     visible colour interpolation during hydration.
 */
const themeScript = `(function(){
  try {
    var m = localStorage.getItem('app-theme-mode');
    if (m !== 'dark' && m !== 'light') {
      m = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var html = document.documentElement;
    html.setAttribute('data-theme', m);
    html.style.colorScheme = m;
    // Set the background colour directly so the browser never shows the wrong
    // background even before the CSS custom properties are resolved.
    html.style.backgroundColor = m === 'dark' ? 'hsl(222,47%,11%)' : '#ffffff';
    html.style.color = m === 'dark' ? 'hsl(210,40%,98%)' : '#171717';
    // Suppress transitions on first paint to avoid animated colour flash
    html.classList.add('theme-switching');
    window.requestAnimationFrame(function(){
      window.requestAnimationFrame(function(){
        html.classList.remove('theme-switching');
        // Let the CSS take over background from here on
        html.style.backgroundColor = '';
        html.style.color = '';
      });
    });
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Must be first — executes synchronously before CSS is applied */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <div className="mobile-blocked-screen">
          <div className="mobile-blocked-screen__card">
            <p className="mobile-blocked-screen__title">Desktop Required</p>
            <p className="mobile-blocked-screen__text">
              This app is available only on desktop screens. Please open it on a laptop or desktop browser.
            </p>
          </div>
        </div>
        <div className="desktop-app">
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
        </div>
      </body>
    </html>
  );
}
