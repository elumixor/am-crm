"use client";
import { UserChip } from "components/UserChip";
import { useAuth } from "contexts/AuthContext";
import { useParams } from "next/navigation";
import router from "next/router";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { validJson } from "services/http";
import styles from "./page.module.scss";

interface User {
  id: string;
  email: string;
  spiritualName?: string | null;
  worldlyName?: string | null;
  preferredName?: string | null;
  preferredNameType?: "spiritual" | "worldly" | "custom" | null;
  displayName?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  languages?: string | null;
  location?: string | null;
  preferredLanguage?: string | null;
  photoKey?: string | null;
  mentor?: {
    id: string;
    displayName?: string | null;
    spiritualName?: string | null;
    worldlyName?: string | null;
    preferredName?: string | null;
    preferredNameType?: string | null;
    photoKey?: string | null;
  } | null;
  mentees?: Array<{
    id: string;
    displayName?: string | null;
    spiritualName?: string | null;
    worldlyName?: string | null;
    preferredName?: string | null;
    preferredNameType?: string | null;
    photoKey?: string | null;
  }>;
  acarya: {
    id: string;
    displayName?: string | null;
    spiritualName?: string | null;
    worldlyName?: string | null;
    preferredName?: string | null;
    preferredNameType?: string | null;
    photoKey?: string | null;
  } | null;
  lessons: Array<{
    id: string;
    lesson: number;
    receivedAt?: string | null;
  }>;
  unit: {
    id: string;
    name: string;
  } | null;
}

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

  // Generate unique IDs for form fields
  const emailId = useId();
  const spiritualNameId = useId();
  const worldlyNameId = useId();
  const preferredNameTypeId = useId();
  const preferredNameId = useId();
  const telegramId = useId();
  const whatsappId = useId();
  const dateOfBirthId = useId();
  const nationalityId = useId();
  const languagesId = useId();
  const locationId = useId();
  const preferredLanguageId = useId();

  const loadUser = useCallback(async () => {
    try {
      const response = await client.users[":id"].$get({ param: { id: userId } });
      const userData = await validJson(response);

      setUser(userData);
      setFormData({
        email: userData.email,
        spiritualName: userData.spiritualName,
        worldlyName: userData.worldlyName,
        preferredName: userData.preferredName,
        preferredNameType: userData.preferredNameType,
        telegram: userData.telegram,
        whatsapp: userData.whatsapp,
        dateOfBirth: userData.dateOfBirth,
        nationality: userData.nationality,
        languages: userData.languages,
        location: userData.location,
        preferredLanguage: userData.preferredLanguage,
      });
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Edit User Profile</h1>
      </div>

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
            <svg className={styles.profilePictureIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      <Section title="Basic Information" grid={true}>
        <div className={styles.formField}>
          <label htmlFor={emailId} className={styles.label}>
            Email
          </label>
          <input id={emailId} type="email" value={formData.email || ""} disabled className={styles.input} />
        </div>

        <div className={styles.formField}>
          <label htmlFor={spiritualNameId} className={styles.label}>
            Spiritual Name
          </label>
          <input
            id={spiritualNameId}
            type="text"
            value={formData.spiritualName || ""}
            onChange={(e) => setFormData({ ...formData, spiritualName: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={worldlyNameId} className={styles.label}>
            Worldly Name
          </label>
          <input
            id={worldlyNameId}
            type="text"
            value={formData.worldlyName || ""}
            onChange={(e) => setFormData({ ...formData, worldlyName: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={preferredNameTypeId} className={styles.label}>
            Preferred Name Type
          </label>
          <select
            id={preferredNameTypeId}
            value={formData.preferredNameType || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                preferredNameType:
                  e.target.value === "" ? null : (e.target.value as "spiritual" | "worldly" | "custom"),
              })
            }
            className={styles.select}
          >
            <option value="">Select...</option>
            <option value="spiritual">Spiritual</option>
            <option value="worldly">Worldly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {formData.preferredNameType === "custom" && (
          <div className={styles.formField}>
            <label htmlFor={preferredNameId} className={styles.label}>
              Custom Preferred Name
            </label>
            <input
              id={preferredNameId}
              type="text"
              value={formData.preferredName || ""}
              onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.formField}>
          <label htmlFor={telegramId} className={styles.label}>
            Telegram
          </label>
          <input
            id={telegramId}
            type="text"
            value={formData.telegram || ""}
            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={whatsappId} className={styles.label}>
            WhatsApp
          </label>
          <input
            id={whatsappId}
            type="text"
            value={formData.whatsapp || ""}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={dateOfBirthId} className={styles.label}>
            Date of Birth
          </label>
          <input
            id={dateOfBirthId}
            type="date"
            value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                dateOfBirth: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={nationalityId} className={styles.label}>
            Nationality
          </label>
          <input
            id={nationalityId}
            type="text"
            value={formData.nationality || ""}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={languagesId} className={styles.label}>
            Languages
          </label>
          <input
            id={languagesId}
            type="text"
            value={formData.languages || ""}
            onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={locationId} className={styles.label}>
            Location
          </label>
          <input
            id={locationId}
            type="text"
            value={formData.location || ""}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor={preferredLanguageId} className={styles.label}>
            Preferred Language
          </label>
          <input
            id={preferredLanguageId}
            type="text"
            value={formData.preferredLanguage || ""}
            onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            className={styles.input}
          />
        </div>

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
      </Section>

      {/* Lessons */}
      <Section title="Lessons" grid={true}>
        {lessonNames.map((name, index) => {
          const hasThisLesson = hasLesson(index);
          const lessonData = userLessons.find((l) => l.lesson === index);

          return (
            <div
              key={`lesson-${name}-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={styles.lessonItem}
            >
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
      </Section>

      {/* Acarya */}
      <Section title="Acarya" requires={user.acarya ?? null} notAvailableText="No acarya assigned">
        {(acarya) => <UserChip user={acarya} />}
      </Section>

      {/* Mentor */}
      <Section title="Mentor" requires={user.mentor ?? null} notAvailableText="No mentor assigned">
        {(mentor) => <UserChip user={mentor} />}
      </Section>

      {/* Mentees */}
      <Section title="Mentees" requires={user.mentees ?? null} notAvailableText="No mentees assigned">
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
      </Section>

      {/* Unit */}
      <Section title="Unit" notAvailableText="No unit assigned" requires={user.unit ?? null}>
        {(unit) => <p>{unit.name}</p>}
      </Section>
    </div>
  );
}

function Section<T>({
  title,
  children,
  notAvailableText = "Not available",
  requires,
  grid = false,
}: {
  title: string;
  requires?: T | null;
  notAvailableText?: string;
  grid?: boolean;
  children: ((data: T, notAvailable: React.ReactNode) => React.ReactNode) | React.ReactNode;
}) {
  const notAvailable = <p style={{ color: "#555" }}>{notAvailableText}</p>;
  if (requires === undefined) {
    return (
      <section className={styles.formSection}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={grid ? styles.formGrid : styles.relationshipSection}>
          {typeof children === "function" ? children(undefined as T, notAvailable) : children}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={grid ? styles.formGrid : styles.relationshipSection}>
        {requires ? (typeof children === "function" ? children(requires, notAvailable) : children) : notAvailable}
      </div>
    </section>
  );
}
