"use client";

import { Button } from "components/button";
import { Form, FormField } from "components/Form";
import { useAuth } from "contexts/AuthContext";
import { canFail, useForm } from "lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResetPasswordPage() {
  const { resetPassword, userId } = useAuth();
  const router = useRouter();
  const [formRef, formData] = useForm();
  const [myResetPassword, error, loading] = canFail(() =>
    resetPassword(formData.email as string, formData.password as string),
  );

  useEffect(() => {
    if (userId) router.replace("/");
  }, [userId]);

  return (
    <Form
      title="Reset Password"
      description="Enter your email and new password"
      error={error}
      onSubmit={myResetPassword}
      ref={formRef}
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
  );
}
