import { HTMLInputTypeAttribute } from "react";

interface InputProps {
  form: unknown;
  error: unknown;
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  id: string;
  title?: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
}

const FormInput = ({
  form,
  error,
  handleChange,
  id,
  type = "string",
  title,
  className = "grid px-1",
}: InputProps) => {
  return (
    <div className={className}>
      <span className="text-left font-medium">
        {title}
        <span className="font-sm pl-2 text-left text-sm text-red-500">
          * {error ? error[id] : ""}
        </span>
      </span>
      <input
        className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={form[id]}
        id={id}
        type={type}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormInput;
