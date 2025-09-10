import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/card";
import NextForm from "next/form";
import { forwardRef } from "react";

interface AuthFormProps {
  title?: string;
  description?: string;
  error?: string | null;
  onSubmit: (formData: FormData) => void | Promise<void>;
  children: {
    fields: React.ReactNode;
    actions: React.ReactNode;
    footer?: React.ReactNode;
  };
}

export const Form = forwardRef<HTMLFormElement, AuthFormProps>(
  ({ title, description, error, onSubmit, children: { fields, actions, footer } }, ref) => {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <NextForm action={onSubmit} ref={ref}>
            <CardContent className="space-y-1">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4">{fields}</div>
              <div className="py-4">{actions}</div>
            </CardContent>
            {footer && <CardFooter className="flex flex-col">{footer}</CardFooter>}
          </NextForm>
        </Card>
      </div>
    );
  },
);
