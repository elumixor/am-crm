"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface MagicLinkInfo {
  email: string;
  expiresAt: string;
  createdBy: {
    spiritualName?: string;
    worldlyName?: string;
    displayName?: string;
    email: string;
  };
}

export default function MagicLinkPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [linkInfo, setLinkInfo] = useState<MagicLinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [password, setPassword] = useState("");
  const [spiritualName, setSpiritualName] = useState("");
  const [worldlyName, setWorldlyName] = useState("");
  const [preferredName, setPreferredName] = useState("");

  const loadMagicLinkInfo = useCallback(async () => {
    if (!token) {
      setError("No magic link token provided");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/magic-link/${token}`);

      if (response.ok) {
        const info = (await response.json()) as MagicLinkInfo;
        setLinkInfo(info);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid magic link");
      }
    } catch (_err) {
      setError("Failed to load magic link information");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const completeMagicLink = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token || !password.trim()) return;

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/complete-magic-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            spiritualName: spiritualName.trim() || undefined,
            worldlyName: worldlyName.trim() || undefined,
            preferredName: preferredName.trim() || undefined,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          // Store auth token and redirect to dashboard
          localStorage.setItem("authToken", result.token);
          router.push("/");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to create account");
        }
      } catch (_err) {
        setError("Failed to create account");
      } finally {
        setSubmitting(false);
      }
    },
    [token, password, spiritualName, worldlyName, preferredName, router],
  );

  useEffect(() => {
    void loadMagicLinkInfo();
  }, [loadMagicLinkInfo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading magic link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Magic Link</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            You've been invited by{" "}
            <strong>
              {linkInfo?.createdBy.spiritualName || linkInfo?.createdBy.displayName || linkInfo?.createdBy.email}
            </strong>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Account will be created for: <strong>{linkInfo?.email}</strong>
          </p>
        </div>

        <form onSubmit={completeMagicLink} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
              placeholder="Choose a strong password"
            />
          </div>

          <div>
            <label htmlFor="spiritualName" className="block text-sm font-medium text-gray-700">
              Spiritual Name
            </label>
            <input
              type="text"
              id="spiritualName"
              value={spiritualName}
              onChange={(e) => setSpiritualName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your spiritual name"
            />
          </div>

          <div>
            <label htmlFor="worldlyName" className="block text-sm font-medium text-gray-700">
              Worldly Name
            </label>
            <input
              type="text"
              id="worldlyName"
              value={worldlyName}
              onChange={(e) => setWorldlyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your worldly name"
            />
          </div>

          <div>
            <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700">
              Preferred Name
            </label>
            <input
              type="text"
              id="preferredName"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="How would you like to be called?"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Expires: {new Date(linkInfo?.expiresAt || "").toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
