import { useEffect, useMemo, useRef, useState } from "react";

export function useForm<T extends HTMLFormElement>() {
  const formRef = useRef<T | null>(null);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const formDataObject = useMemo(() => Object.fromEntries(formData.entries()), [formData]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // handler that re-reads the form values
    const update = () => setFormData(new FormData(form));

    // update immediately and on every input/change
    update();
    form.addEventListener("input", update);
    form.addEventListener("change", update);

    return () => {
      form.removeEventListener("input", update);
      form.removeEventListener("change", update);
    };
  }, []);

  return [formRef, formDataObject] as const;
}
