import NavBar from "components/NavBar";
import { AuthProvider } from "contexts/AuthContext";
// import { ErrorProvider } from "contexts/ErrorContext";
// import { ErrorNotifications } from "components/ErrorNotifications";
import type React from "react";
import "styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <ErrorProvider> */}
        <AuthProvider>
          <NavBar />
          {children}
          {/* <ErrorNotifications /> */}
        </AuthProvider>
        {/* </ErrorProvider> */}
      </body>
    </html>
  );
}
