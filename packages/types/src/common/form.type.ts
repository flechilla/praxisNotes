/**
 * Form utility types
 * Common types for form handling, validation, and submission
 */

/**
 * Generic form state type
 */
export type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
};

/**
 * Form field configuration
 */
export type FormField<T = any> = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{
    label: string;
    value: string | number | boolean;
  }>;
  validation?: {
    required?: boolean | string;
    pattern?: {
      value: RegExp;
      message: string;
    };
    min?: number | string;
    max?: number | string;
    minLength?: number | string;
    maxLength?: number | string;
    validate?: (value: T) => string | boolean;
  };
};

/**
 * Form submission handler
 */
export type FormSubmitHandler<T> = (values: T) => void | Promise<void>;

/**
 * Form validation error
 */
export type FormValidationError<T> = Partial<Record<keyof T, string>>;

/**
 * Form field change handler
 */
export type FormChangeHandler = (
  event: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => void;

/**
 * Form select option
 */
export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};
