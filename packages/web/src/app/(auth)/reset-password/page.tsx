"use client";

import { Form, FormField } from "components/form";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import z from "zod";

const resetPasswordSchema = z.object({
  email: z.email().default(""),
  password: z.string().min(6).max(100).default(""),
});

export default function ResetPasswordPage() {
  const { resetPassword, userId } = useAuth();
  const router = useRouter();
  const [myResetPassword, error, loading] = useAsyncWithError(resetPassword);

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <div className="flex items-center justify-center p-4">
      <Form
        title="Reset Password"
        description="Enter your email and new password"
        schema={resetPasswordSchema}
        error={error}
        onSubmit={(v) => myResetPassword(v.email, v.password)}
      >
        {{
          fields: (
            <>
              <FormField name="email" type="email" placeholder="Enter your email" required />
              <FormField name="password" type="password" placeholder="Enter your new password" required />
            </>
          ),
          actions: (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          ),
          footer: (
            <Link href="/login" className="text-sm text-primary hover:underline">
              ← Back to login
            </Link>
          ),
        }}
      </Form>
    </div>
  );
}
