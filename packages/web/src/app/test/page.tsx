"use client";

import { Form, FormField } from "components/Form";
import { useForm } from "lib/use-form";
import { useEffect } from "react";

export default function LoginPage() {
  const [formRef, currentFormData] = useForm();

  useEffect(() => {
    console.log("current form state", {
      email: currentFormData.Email,
      password: currentFormData.Password,
    });
  }, [currentFormData]);

  return (
    <Form ref={formRef} title="Sign In" onSubmit={(data) => console.log("submit", data)}>
      {{
        fields: (
          <>
            <FormField name="Email" type="email" required />
            <FormField name="Password" type="password" required />
          </>
        ),
        actions: <button type="submit">Sign In</button>,
      }}
    </Form>
  );
}
