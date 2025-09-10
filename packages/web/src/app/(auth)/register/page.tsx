"use client";

import { Button } from "components/button";
import { Form, FormField } from "components/Form";
import { useAuth } from "contexts/AuthContext";
import { canFail, useForm } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const { register, userId } = useAuth();
  const router = useRouter();
  const [formRef, formData] = useForm();
  const [myRegister, error, loading] = canFail(() => register(formData.email as string, formData.password as string));

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <Form
      title="Create Account"
      description="Create a new account to get started"
      error={error}
      onSubmit={myRegister}
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
  );
}
