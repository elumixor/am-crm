"use client";

import MagicLinkCreator from "components/MagicLinkCreator";
import { useState } from "react";

export default function MagicLinkDemoPage() {
  const [createdLinks, setCreatedLinks] = useState<Array<{ email: string; link: string; createdAt: Date }>>([]);

  const handleLinkCreated = (link: string, email: string) => {
    setCreatedLinks((prev) => [...prev, { email, link, createdAt: new Date() }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Magic Link Authorization System</h1>
          <p className="text-gray-600">Demo page showing the magic link creation and usage flow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Magic Link Creator */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">For Acaryas: Create Magic Links</h2>
            <MagicLinkCreator onLinkCreated={handleLinkCreated} />
          </div>

          {/* Created Links History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Created Magic Links</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {createdLinks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No magic links created yet. Create one using the form on the left.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {createdLinks.map((item, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.email}</p>
                          <p className="text-xs text-gray-500">{item.createdAt.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.link)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copy Link
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 break-all">{item.link}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 1: Create Magic Link</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enter an email address in the form</li>
                <li>• Click "Create Magic Link"</li>
                <li>• The link will be copied to clipboard</li>
                <li>• Link expires in 7 days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Step 2: Use Magic Link</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Open the magic link in a new tab</li>
                <li>• Fill in the account creation form</li>
                <li>• Submit to create the account</li>
                <li>• User is automatically logged in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Endpoints Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
          <div className="space-y-4 text-sm">
            <div className="border border-gray-200 rounded p-3">
              <div className="font-mono text-blue-600 mb-1">POST /auth/create-magic-link</div>
              <div className="text-gray-600">Creates a new magic link invitation</div>
              <div className="text-xs text-gray-500 mt-1">Requires authentication</div>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="font-mono text-green-600 mb-1">GET /auth/magic-link/:token</div>
              <div className="text-gray-600">Gets magic link information</div>
              <div className="text-xs text-gray-500 mt-1">Public endpoint</div>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <div className="font-mono text-purple-600 mb-1">POST /auth/complete-magic-link</div>
              <div className="text-gray-600">Completes account creation via magic link</div>
              <div className="text-xs text-gray-500 mt-1">Public endpoint</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
