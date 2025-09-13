"use client";

import { useEffect, useRef } from "react";

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (data: TelegramUser) => void;
  size?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  disabled?: boolean;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

export function TelegramLoginButton({
  botName,
  onAuth,
  size = "large",
  cornerRadius = 10,
  requestAccess = true,
  usePic = false,
  disabled = false,
}: TelegramLoginButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!botName || disabled) return;

    // Set up global callback
    window.onTelegramAuth = onAuth;

    // Create script element
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", size);
    script.setAttribute("data-radius", cornerRadius.toString());
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", requestAccess ? "write" : "");
    if (usePic) script.setAttribute("data-userpic", "true");

    // Clear any existing content and append script
    if (ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(script);
    }

    return () => {
      // Cleanup
      delete window.onTelegramAuth;
    };
  }, [botName, onAuth, size, cornerRadius, requestAccess, usePic, disabled]);

  if (disabled) {
    return (
      <div className="w-full p-3 bg-gray-100 text-gray-500 rounded-lg text-center">
        Telegram login not available
      </div>
    );
  }

  return <div ref={ref} className="telegram-login-widget" />;
}