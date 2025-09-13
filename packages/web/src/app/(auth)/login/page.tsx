"use client";

import { Form, FormField } from "components/form";
import { Button } from "components/shad/button";
import { 
  GoogleSignInButton, 
  AppleSignInButton, 
  FacebookSignInButton, 
  InstagramSignInButton,
  WhatsAppSignInButton
} from "components/auth/OAuthButtons";
import { TelegramLoginButton } from "components/auth/TelegramLoginButton";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import z from "zod";

const loginSchema = z.object({
  email: z.email().default(""),
  password: z.string().min(6).max(100).default(""),
});

export default function LoginPage() {
  const { login: _login, userId } = useAuth();
  const router = useRouter();
  const [login, error, loading] = useAsyncWithError(_login);
  const { data: session } = useSession();

  useEffect(() => {
    if (userId || session?.user) router.replace("/");
  }, [userId, session]);

  const handleTelegramAuth = async (user: { 
    id: number; 
    first_name: string; 
    username?: string;
    [key: string]: unknown;
  }) => {
    try {
      // Handle Telegram authentication
      // You would need to implement this in your auth context
      console.log("Telegram user:", user);
      router.replace("/");
    } catch (error) {
      console.error("Telegram auth error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* OAuth Buttons */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-center text-muted-foreground">
            Choose your preferred sign-in method
          </p>
          
          <div className="space-y-2">
            <GoogleSignInButton disabled={loading} />
            <AppleSignInButton disabled={loading} />
            <FacebookSignInButton disabled={loading} />
            <WhatsAppSignInButton disabled={loading} />
            <InstagramSignInButton disabled={loading} />
            
            {/* Telegram Login Widget */}
            <div className="flex justify-center">
              <TelegramLoginButton
                botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ""}
                onAuth={handleTelegramAuth}
                disabled={loading || !process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <Form
          title=""
          description=""
          schema={loginSchema}
          error={error}
          onSubmit={(v) => login(v.email, v.password)}
          layout="single-column"
        >
          {{
            fields: (
              <>
                <FormField name="email" type="email" placeholder="Enter your email" required />
                <FormField name="password" type="password" placeholder="Enter your password" required />
              </>
            ),
            actions: (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            ),
            footer: (
              <>
                <Link href="/reset-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </>
            ),
          }}
        </Form>
      </div>
    </div>
  );
}
