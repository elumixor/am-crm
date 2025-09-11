import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/shad/card";
import { type DefaultValues, useForm } from "react-hook-form";
import type { ZodObject, z } from "zod";
import { Form as ShadForm } from "../shad/form";
import { FormContext } from "./FormContext";

interface FormProps<T extends ZodObject> {
  title?: string;
  description?: string;
  error?: string | null;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: z.infer<T>;
  className?: string;
  schema: T;
  children: {
    fields: React.ReactNode;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
  };
}

export function Form<T extends ZodObject>({
  title,
  description,
  error,
  schema,
  onSubmit,
  className,
  defaultValues = schema.parse({}),
  children: { fields, actions, footer },
}: FormProps<T>) {
  const form = useForm<z.infer<T>>({
    // biome-ignore lint/suspicious/noExplicitAny: Somehow it cannot infer correctly
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as DefaultValues<z.infer<T>>,
  });

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <ShadForm {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="mb-4">
            {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>

          {/** biome-ignore lint/suspicious/noExplicitAny: Infer system not strong enough */}
          <FormContext.Provider value={form as any}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
                  {error}
                </div>
              )}
              {fields}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {actions && <div className="w-full mt-4">{actions}</div>}
              {footer && <div className="w-full text-center">{footer}</div>}
            </CardFooter>
          </FormContext.Provider>
        </form>
      </ShadForm>
    </Card>
  );
}
