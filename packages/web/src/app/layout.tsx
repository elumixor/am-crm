import NavBar from "components/NavBar";
import { AuthProvider } from "contexts/AuthContext";
import { NextAuthProvider } from "components/NextAuthProvider";
// import { ErrorProvider } from "contexts/ErrorContext";
// import { ErrorNotifications } from "components/ErrorNotifications";
import type React from "react";
import "styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <ErrorProvider> */}
        <NextAuthProvider>
          <AuthProvider>
            <NavBar />
            {children}
            {/* <ErrorNotifications /> */}
          </AuthProvider>
        </NextAuthProvider>
        {/* </ErrorProvider> */}
      </body>
    </html>
  );
}
