import { type Movie } from "@prisma/client";
import React, { type HTMLInputTypeAttribute, useState } from "react";

type MovieFormFields = Omit<Movie, "updatedAt" | "createdAt" | "id">;

const EmptyMovieFormFields = {
  title: "",
  category: "",
  cast: "",
  director: "",
  producer: "",
  synopsis: "",
};
interface InputProps {
  form: MovieFormFields;
  error: MovieFormFields | null;
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

interface Props {
  onSubmit: () => null;
  defaultValues?: MovieFormFields;
  submitText?: string;
}

const MovieForm = ({
  onSubmit,
  defaultValues = EmptyMovieFormFields,
  submitText = "Submit",
}: Props) => {
  const [error, setError] = useState<MovieFormFields>(EmptyMovieFormFields);
  const [form, setForm] = useState<MovieFormFields>(defaultValues);

  const handleChange = (
    event: React.FormEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  function handleSubmit() {
    let doSubmit = true;
    Object.keys(form).forEach((key) => {
      console.log(key, form[key]);
      if ((form[key] as string).length === 0) {
        doSubmit = false;
        setError((prev) => ({
          ...prev,
          [key]: "Field is required",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          [key]: "",
        }));
      }
    });

    if (doSubmit) onSubmit();
  }

  return (
    <div className="my-2 grid grid-cols-2">
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="title"
        title="Title"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="category"
        title="Category"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="director"
        title="Director"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="producer"
        title="Producer"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="cast"
        title="Cast"
        className="col-span-2 grid px-1"
      />
      <div className="col-span-2 grid px-1">
        <span className="text-left font-medium">
          Synopsis{" "}
          <span className="font-sm pl-2 text-left text-sm text-red-500">
            * {error ? error.synopsis : ""}
          </span>
        </span>

        <textarea
          value={form.synopsis}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, synopsis: e.target.value }));
          }}
          className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid px-1">
        <span className="text-left font-medium">
          MPAA US FilmRating
          <span className="font-sm pl-2 text-left text-sm text-red-500">
            * {error ? error.MP4AAUSFilmRating : ""}
          </span>
        </span>
        <select
          value={form.MPAAUSFilmRating}
          onChange={handleChange}
          className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {["G", "PG", "PG-13", "R"].map((state) => (
            <option key={state}>{state}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2 grid px-1 py-3">
        <button
          className=" h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
          type="submit"
          onClick={handleSubmit}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
};

export default MovieForm;
