export type InputType = {
  label: string;
  name: string;
  placeholder: string;
  description?: string;
  messageError?: string;
  type?:
    | "text"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | undefined;
};
