import { useEffect, useState } from "react";
import { getSignedUrl } from "../services/http";

export function useSignedUrl({ key, defaultUrl }: { key?: string; defaultUrl?: string } = {}) {
  const [url, setUrl] = useState(defaultUrl);
  const [_key, setKey] = useState(key);

  useEffect(() => {
    void (async () => {
      if (!_key) return setUrl(undefined);

      const newUrl = await getSignedUrl(_key);
      setUrl(newUrl);
    })();
  }, [_key]);

  return [url, setKey, setUrl] as const;
}
