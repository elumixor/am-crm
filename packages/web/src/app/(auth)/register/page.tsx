"use client";

import { Form, FormField } from "components/something";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import z from "zod";

const registerSchema = z.object({
  email: z.email().default(""),
  password: z.string().min(6).max(100).default(""),
});

export default function RegisterPage() {
  const { register: _register, userId } = useAuth();
  const router = useRouter();
  const [register, error, loading] = useAsyncWithError(_register);

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <div className="flex items-center justify-center p-4">
      <Form
        title="Create Account"
        description="Create a new account to get started"
        schema={registerSchema}
        error={error}
        onSubmit={(v) => register(v.email, v.password)}
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          ),
          footer: (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          ),
        }}
      </Form>
    </div>
  );
}
