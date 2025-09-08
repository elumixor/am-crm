import NavBar from "components/NavBar";
import { AuthProvider } from "contexts/AuthContext";
import type React from "react";
import "styles/global.scss";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
