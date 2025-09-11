"use client";

import { Form, FormField } from "components/something";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import z from "zod";

const loginSchema = z.object({
  email: z.email().default(""),
  password: z.string().min(6).max(100).default(""),
});

export default function LoginPage() {
  const { login: _login, userId } = useAuth();
  const router = useRouter();
  const [login, error, loading] = useAsyncWithError(_login);

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <div className="flex items-center justify-center p-4">
      <Form
        title="Sign In"
        description="Enter your email and password to access your account"
        schema={loginSchema}
        error={error}
        onSubmit={(v) => login(v.email, v.password)}
        layout="two-column"
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
  );
}
