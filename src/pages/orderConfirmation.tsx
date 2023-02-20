import React from "react";
import Image from "next/image";
const orderConfirmation = () => {
  const src = "https://via.placeholder.com/600x150/09f/fff?text=Movie+Name";
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-8 shadow-md">
        <h2 className="mb-2 text-xl font-bold">Order Confirmed</h2>
        <p className="">Order Total: $22</p>
        <p className="mb-4">
          Thank you for ordering tickets! You should receive a confirmation
          email shortly.
        </p>

        <div className="flex grid items-center justify-center border border-black bg-gray-100 text-center">
          <div className="my-20px">
            <h2 className="mt-2 text-black">
              Showtime: 10:50 Monday 2/19/2023
            </h2>
            <h2 className="text-black">$10 Child Ticket</h2>
          </div>

          <img
            src={src}
            style={{ objectFit: "cover" }}
            className="mx-5 mb-5 border"
          />
        </div>
        <div className="my-2 flex grid items-center justify-center border border-black bg-gray-100 text-center">
          <div className="my-20px">
            <h2 className="mt-2 text-black">
              Showtime: 10:50 Monday 2/19/2023
            </h2>
            <h2 className="text-black">$12 Adult Ticket</h2>
          </div>

          <img
            src={src}
            style={{ objectFit: "cover" }}
            className="mx-5 mb-5 border"
          />
        </div>
        <div className="justify-center flex">
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Print Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default orderConfirmation;
