"use client";

import { type UserUpdateInput, userUpdateSchema } from "@am-crm/shared";
import { Form, FormField } from "components/form";
import { Button } from "components/shad/button";
import { useAuth } from "contexts/AuthContext";
import { useAsyncWithError } from "lib";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { validJson } from "services/http";

const preferredNameOptions = [
  { value: "worldly", label: "Worldly Name" },
  { value: "spiritual", label: "Spiritual Name" },
  { value: "custom", label: "Custom" },
];

interface UserEditFormProps {
  user: UserUpdateInput & { id: string };
}

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter();
  const { client } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const [submit, error, isLoading] = useAsyncWithError(async (data: UserUpdateInput) => {
    // preferredName logic: only send if custom selected
    if (data.preferredNameType !== "custom") data.preferredName = undefined;

    await validJson(client.users[":id"].$put({ param: { id: user.id }, json: data }));

    router.push(`/users/${user.id}`);
  });

  // Prepare default values for the form
  const defaultValues = {
    ...Object.fromEntries(Object.entries(user).map(([k, v]) => [k, v ?? ""])), // map null/undefined to ""
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().substring(0, 10) : "",
  };

  return (
    <Form
      title="Edit Profile"
      description="Update your profile information"
      schema={userUpdateSchema}
      error={error}
      onSubmit={submit}
      defaultValues={defaultValues}
      variant="standalone"
      layout="two-column"
    >
      {{
        fields: (
          <>
            <FormField name="email" type="email" placeholder="Enter your email" disabled />
            <FormField name="worldlyName" placeholder="Enter your worldly name" />
            <FormField name="spiritualName" placeholder="Enter your spiritual name" />
            <FormField
              name="preferredNameType"
              type="select"
              options={preferredNameOptions}
              label="Preferred Name Type"
              onChange={(value) => {
                if (ref.current) ref.current.hidden = value !== "custom";
              }}
            />
            <div ref={ref} hidden={user.preferredNameType !== "custom"}>
              {
                <FormField
                  name="preferredName"
                  placeholder="Enter your custom preferred name"
                  label="Custom Preferred Name"
                />
              }
            </div>
            <FormField name="telegram" placeholder="Enter your Telegram handle" />
            <FormField name="whatsapp" placeholder="Enter your WhatsApp number" />
            <FormField name="dateOfBirth" type="date" label="Date of Birth" />
            <FormField name="nationality" placeholder="Enter your nationality" />
            <FormField name="languages" type="textarea" placeholder="Enter languages you speak" rows={3} />
            <FormField name="location" placeholder="Enter your location" />
            <FormField name="preferredLanguage" placeholder="Enter your preferred language" />
          </>
        ),
        actions: (
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        ),
      }}
    </Form>
  );
}
