import { Calendar } from "components/shad/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/shad/popover";
import { Button } from "components/shad/button";
import { FormControl } from "components/shad/form";
import { cn } from "lib/cn";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DateInputProps {
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  // biome-ignore lint/suspicious/noExplicitAny: Field type from react-hook-form
  field: any;
}

export const DateInput = ({ placeholder, disabled, onChange, field }: DateInputProps): ReactNode => (
  <Popover>
    <PopoverTrigger asChild>
      <FormControl>
        <Button
          variant="outline"
          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
          disabled={disabled}
        >
          {field.value ? format(field.value, "PPP") : <span>{placeholder || "Pick a date"}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={field.value}
        onSelect={(date) => {
          const formatted = date ? format(date, "yyyy-MM-dd") : "";
          field.onChange(formatted);
          onChange?.(formatted);
        }}
        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        captionLayout="dropdown"
      />
    </PopoverContent>
  </Popover>
);
