import { InputType } from "@/@types/input.type";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

interface GenerateFormFieldsProps {
  inputs: InputType[];
  form: ReturnType<typeof useForm>;
}

export function GenerateFormFields({ inputs, form }: GenerateFormFieldsProps) {
  return inputs.map((input) => {
    return (
      <FormField
        key={input.name}
        control={form.control}
        name={input.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={field.name}>{input.label}</FormLabel>
            <FormControl>
              <Input
                id={field.name}
                type={input.type}
                placeholder={input.placeholder}
                min={input.type === "number" ? 1 : undefined}
                {...field}
              />
            </FormControl>
            <FormDescription>{input.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  });
}
