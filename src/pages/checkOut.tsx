import React from "react";
import CheckOutForm from "../components/CheckOutForm";

const checkOut = () => {
  return (
    <div className="flex grid w-full items-center justify-center">
      <h1 className="my-4 rounded-lg bg-white p-6 text-center text-3xl font-medium shadow-md">
        CheckOut
      </h1>
      <CheckOutForm />
      <div className="mt-5 flex justify-end">
        <button className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700">
          Check Out
        </button>
      </div>
    </div>
  );
};

export default checkOut;
