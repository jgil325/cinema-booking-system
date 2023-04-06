import { Promotion } from "@prisma/client";
import { useState } from "react";
import FormInput from "../ui/FormInput";
type PromotionForm = Omit<Promotion, "id" | "startDate" | "endDate"> & {
  startDate: string;
  endDate: string;
};

const DefaultFormValues: PromotionForm = {
  title: "",
  description: "",
  discount: 0,
  code: "",
  startDate: "",
  endDate: "",
};

interface Props {
  onSubmit: Function;
  submitText?: string;
}

const PromotionForm = ({ onSubmit, submitText = "Submit" }: Props) => {
  const [error, setError] = useState<
    Omit<PromotionForm, "discount"> & { discount: string }
  >({
    ...DefaultFormValues,
    discount: "",
  });
  const [form, setForm] = useState<PromotionForm>(DefaultFormValues);

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
    if (form.discount > 100 || form.discount < 0) {
      doSubmit = false;
      setError((prev) => {
        return {
          ...prev,
          discount: "Must be a number 0 - 100",
        };
      });
    } else {
      setError((prev) => {
        return {
          ...prev,
          discount: "",
        };
      });
    }

    if (form.code.length < 3) {
      doSubmit = false;
      setError((prev) => ({
        ...prev,
        code: "Must be at least 3 characters long",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        code: "",
      }));
    }

    const currentDate = new Date();
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    const finalDate = new Date(2025, 11, 31);
    console.log(endDate, finalDate, endDate > finalDate);
    if (currentDate > startDate) {
      doSubmit = false;
      setError((prev) => ({
        ...prev,
        startDate: "Promotion date cannot start prior to now",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        startDate: "",
      }));
    }

    if (endDate > finalDate) {
      doSubmit = false;
      setError((prev) => ({
        ...prev,
        endDate: "Promotion end date must be before January 1st, 2026",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        endDate: "",
      }));
    }

    Object.keys(form).forEach((key) => {
      if ((form[key] as string).length === 0) {
        doSubmit = false;
        setError((prev) => ({
          ...prev,
          [key]: "Field is required",
        }));
      } else if (error[key] === "Field is required") {
        setError((prev) => ({
          ...prev,
          [key]: "",
        }));
      }
    });

    if (doSubmit) onSubmit(form);
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
        id="description"
        title="Description"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="discount"
        title="Discount %"
        type="number"
      />
      <FormInput
        form={form}
        error={error}
        handleChange={handleChange}
        id="code"
        title="Code"
      />
      <div className="mx-1 grid">
        <span className="text-left font-medium">
          Start Date
          <span className="font-sm pl-2 text-left text-sm text-red-500">
            * {error ? error.startDate : ""}
          </span>
        </span>
        <input
          className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="mx-1 grid">
        <span className="text-left font-medium">
          End Date
          <span className="font-sm pl-2 text-left text-sm text-red-500">
            * {error ? error.endDate : ""}
          </span>
        </span>
        <input
          className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={form.endDate}
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

export default PromotionForm;
