import React, { useState } from "react";
import { Show } from "@prisma/client";
interface Props {
  onSubmit: Function;
  submitText?: string;
  movieId: string | undefined;
}
interface FormProps {
  showTime: string;
}
const defaultFormValues: FormProps = {
  showTime: "",
};
const ScheduleMovieForm = ({
  onSubmit,
  submitText = "Submit",
  movieId,
}: Props) => {
  const [error, setError] = useState<FormProps>(defaultFormValues);
  const [form, setForm] = useState<FormProps>(defaultFormValues);

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

    if (!movieId) throw "No Movie Id Provided";

    if (doSubmit) onSubmit({ showTime: new Date(form.showTime), movieId });
  }
  
  return (
    <div className="grid">
      <div className="grid px-1">
        <span className="text-left font-medium">
          Showtime
          <span className="font-sm pl-2 text-left text-sm text-red-500">
            * {error ? error.showTime : ""}
          </span>
        </span>

        <input
          className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="datetime-local"
          id="showTime"
          name="showTime"
          value={form.showTime}
          onChange={handleChange}
        />
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

export default ScheduleMovieForm;
