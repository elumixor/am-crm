"use client";

import { useState } from "react";

interface MagicLinkCreatorProps {
  onLinkCreated?: (link: string, email: string) => void;
}

export default function MagicLinkCreator({ onLinkCreated }: MagicLinkCreatorProps) {
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // Get auth token from localStorage or context
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("You must be logged in to create magic links");
        return;
      }

      const response = await fetch("/api/auth/create-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        const result = await response.json();
        const magicLink = `${window.location.origin}/magic-link?token=${result.token}`;

        setSuccess(`Magic link created! Valid until ${new Date(result.expiresAt).toLocaleString()}`);
        setEmail(""); // Clear form

        // Copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(magicLink);
          setSuccess((prev) => `${prev} (Link copied to clipboard)`);
        }

        onLinkCreated?.(magicLink, email.trim());
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create magic link");
      }
    } catch (err) {
      setError("Failed to create magic link");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Magic Link Invitation</h3>

      <form onSubmit={createMagicLink} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="invitee@example.com"
            required
          />
          <p className="mt-1 text-xs text-gray-500">The person will receive a magic link to create their account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={creating || !email.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Magic Link...
            </>
          ) : (
            "Create Magic Link"
          )}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Enter the email of the person you want to invite</li>
          <li>• A secure magic link will be generated (valid for 7 days)</li>
          <li>• Share the link with the person via email or other means</li>
          <li>• They click the link to create their account with a password</li>
          <li>• The link can only be used once</li>
        </ul>
      </div>
    </div>
  );
}
