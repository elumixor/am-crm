"use client";
import { UserChip } from "components/UserChip";
import { useAuth } from "contexts/AuthContext";
import { useParams } from "next/navigation";
import router from "next/router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { validJson } from "services/http";
import styles from "./page.module.scss";
import { Form, FormField, FormSection } from "components/Form";
import type { User } from "@am-crm/shared";
import { Required } from "components/Required";

const lessonNames = ["Nama Mantra", "Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6"];

export default function UserEditPage() {
  const { client, userId: currentUserId } = useAuth();

  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    email?: string;
    spiritualName?: string | null;
    worldlyName?: string | null;
    preferredName?: string | null;
    preferredNameType?: "spiritual" | "worldly" | "custom" | null;
    telegram?: string | null;
    whatsapp?: string | null;
    dateOfBirth?: string | null;
    nationality?: string | null;
    languages?: string | null;
    location?: string | null;
    preferredLanguage?: string | null;
  }>({});
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const loadUser = useCallback(async () => {
    try {
      const response = await client.users[":id"].$get({ param: { id: userId } });
      const userData = await validJson(response);

      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void (async () => {
      if (!user?.photoKey) return;

      const photoResponse = await client.signedUrl.$post({ json: { key: user.photoKey } });
      const { url } = await validJson(photoResponse);

      setPhotoUrl(url);
    })();
  }, [user]);

  useEffect(() => {
    void loadUser();
  }, []);

  const saveUser = useCallback(async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await client.users[":id"].$put({
        param: { id: userId },
        json: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("User updated successfully!");
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  }, [user, userId, formData]);

  const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const response = await client.users[":id"].photo.$post({ param: { id: userId }, form: { photo: file } });
      const { key } = await validJson(response);
      setUser((prev) => (prev ? { ...prev, photoKey: key } : null));
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  const addLesson = useCallback(
    async (lesson: number) => {
      const response = await client.users[":id"].lessons.$post({
        param: { id: userId },
        json: { lesson, receivedAt: new Date().toISOString() },
      });

      validJson(response);
      void loadUser(); // Reload to get updated lessons
    },
    [userId, loadUser],
  );

  const removeLesson = useCallback(
    async (lesson: number) => {
      const response = await client.users[":id"].lessons[":lesson"].$delete({
        param: { id: userId, lesson: lesson.toString() },
      });
      validJson(response);

      void loadUser(); // Reload to get updated lessons
    },
    [userId, loadUser],
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>User not found</div>
      </div>
    );
  }

  if (userId !== currentUserId) router.replace(`/users/${userId}`);

  const userLessons = user.lessons || [];
  const hasLesson = (lesson: number) => userLessons.some((l) => l.lesson === lesson);

  const onSubmit = (e: FormData) => {
    void saveUser();
  };

  return (
    <>
      <Form title="Edit User Profile" onSubmit={onSubmit}>
        {{
          fields: (
            <>
              {/* Profile Picture Section */}
              <div className={styles.profileSection}>
                <button
                  type="button"
                  className={styles.profilePicture}
                  style={photoUrl ? { backgroundImage: `url(${photoUrl})` } : {}}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile picture"
                >
                  {!photoUrl && (
                    <svg
                      className={styles.profilePictureIcon}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                  <div className={styles.profilePictureOverlay}>
                    <div className={styles.profilePictureText}>{uploadingPhoto ? "Uploading..." : "Change Photo"}</div>
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className={styles.hiddenInput}
                  disabled={uploadingPhoto}
                />
              </div>
              {/* Basic Information */}
              <FormSection title="Basic Information">
                <FormField name="Email" type="email" value={formData.email || ""} disabled />

                <FormField
                  name="Spiritual Name"
                  type="text"
                  value={formData.spiritualName || ""}
                  onChange={(e) => setFormData({ ...formData, spiritualName: e.target.value })}
                />

                <FormField
                  name="Worldly Name"
                  type="text"
                  value={formData.worldlyName || ""}
                  onChange={(e) => setFormData({ ...formData, worldlyName: e.target.value })}
                />

                <FormField
                  name="Preferred Name Type"
                  type="select"
                  value={formData.preferredNameType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredNameType:
                        e.target.value === "" || e.target.value === "Select..."
                          ? null
                          : (e.target.value.toLowerCase() as "spiritual" | "worldly" | "custom"),
                    })
                  }
                  options={["Select...", "Spiritual", "Worldly", "Custom"]}
                />

                {formData.preferredNameType === "custom" && (
                  <FormField
                    name="Custom Preferred Name"
                    type="text"
                    value={formData.preferredName || ""}
                    onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                  />
                )}

                <FormField
                  name="Telegram"
                  type="text"
                  value={formData.telegram || ""}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                />

                <FormField
                  name="WhatsApp"
                  type="text"
                  value={formData.whatsapp || ""}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />

                <FormField
                  name="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />

                <FormField
                  name="Nationality"
                  type="text"
                  value={formData.nationality || ""}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />

                <FormField
                  name="Languages"
                  type="text"
                  value={formData.languages || ""}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                />

                <FormField
                  name="Location"
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <FormField
                  name="Preferred Language"
                  type="text"
                  value={formData.preferredLanguage || ""}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                />
              </FormSection>
            </>
          ),
          actions: (
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={saveUser}
                disabled={saving}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ),
        }}
      </Form>

      {/* Lessons */}
      {/* <Section title="Lessons" grid={true}>
        {lessonNames.map((name, index) => {
          const hasThisLesson = hasLesson(index);
          const lessonData = userLessons.find((l) => l.lesson === index);

          return (
            <div key={name} className={styles.lessonItem}>
              <span className={styles.lessonName}>{name}</span>
              {hasThisLesson ? (
                <>
                  <span className={styles.lessonDate}>
                    {lessonData?.receivedAt ? new Date(lessonData.receivedAt).toLocaleDateString() : "No date"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => addLesson(index)}
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  Add
                </button>
              )}
            </div>
          );
        })}
      </Section> */}

      {/* Acarya */}
      {/* <Section title="Acarya" requires={user.acarya ?? null} notAvailableText="No acarya assigned">
        {(acarya) => <UserChip user={acarya} />}
      </Section> */}

      {/* Mentor */}
      {/* <Section title="Mentor" requires={user.mentor ?? null} notAvailableText="No mentor assigned">
        {(mentor) => <UserChip user={mentor} />}
      </Section> */}

      {/* Mentees */}
      {/* <Section title="Mentees" requires={user.mentees ?? null} notAvailableText="No mentees assigned">
        {(mentees, notAvailable) =>
          mentees.length > 0 ? (
            <div className={styles.relationshipSection}>
              {mentees.map((mentee) => (
                <UserChip key={mentee.id} user={mentee} />
              ))}
            </div>
          ) : (
            notAvailable
          )
        }
      </Section> */}

      {/* Unit */}
      {/* <FormSection title="Unit">
        <Required item={user.unit ?? null} notAvailableText="No unit assigned">
          {(unit) => <p>{unit.name}</p>}
        </Required>
      </FormSection> */}
    </>
  );
}
