"use client";

import { Button } from "components/button";
import { Form, FormField } from "components/Form";
import { useAuth } from "contexts/AuthContext";
import { canFail, useForm } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, userId } = useAuth();
  const router = useRouter();
  const [formRef, formData] = useForm();
  const [myLogin, error, loading] = canFail(() => login(formData.email as string, formData.password as string));

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <Form
      title="Sign In"
      description="Enter your email and password to access your account"
      error={error}
      onSubmit={myLogin}
      ref={formRef}
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
  );
}
