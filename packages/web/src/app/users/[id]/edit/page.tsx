"use client";

import { Form, FormField } from "components/Form";
import { useAuth } from "contexts/AuthContext";
import { useForm } from "lib";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { HashLoader } from "react-spinners";

const preferredNameOptions = ["Worldly Name", "Spiritual Name", "Custom"];

export default function UserEditPage() {
  const { userId: currentUserId, loaded } = useAuth();
  const params = useParams();
  const router = useRouter();

  // Show loader while auth state is loading
  if (!loaded) return <HashLoader />;

  // Only allow editing own profile
  const userId = params.id as string;
  if (userId !== currentUserId) {
    return (
      <main className="container text-center mt-lg">
        <p>You can only edit your own profile.</p>
        <button type="button" className="link mt-sm" onClick={() => router.back()}>
          ← Go Back
        </button>
      </main>
    );
  }

  return <ActualForm userId={userId} />;
}

function ActualForm({ userId }: { userId: string }) {
  const [formRef, currentFormData] = useForm();

  // Handle form submission
  function onSubmit(data: FormData) {
    console.log(data);
  }

  useEffect(() => {
    console.log("current form state", currentFormData);
  }, [currentFormData]);

  useEffect(() => {
    console.log("formRef changed", formRef.current);
  }, [formRef]);

  return (
    <Form onSubmit={onSubmit} ref={formRef}>
      {{
        fields: (
          <>
            <FormField name="Email" type="email" disabled />
            <FormField name="Worldly Name" defaultValue="Hello" type="text" />
            <FormField name="Spiritual Name" type="text" />
            <FormField name="Preferred Name" type="select" options={preferredNameOptions} />
            {currentFormData["Preferred Name"] === "Custom" && <FormField name="Custom Preferred Name" type="text" />}
            <FormField name="Telegram" type="text" />
            <FormField name="WhatsApp" type="text" />
            <FormField name="Date of Birth" type="date" />
            <FormField name="Nationality" type="text" />
            <FormField name="Languages" type="text" />
            <FormField name="Location" type="text" />
            <FormField name="Preferred Language" type="text" />
          </>
        ),
        actions: (
          <button type="submit" className="primary">
            Save
          </button>
        ),
      }}
    </Form>
  );
}
