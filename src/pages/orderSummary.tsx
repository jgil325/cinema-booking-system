import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const orderSummary = () => {
  const src = "https://via.placeholder.com/600x150/09f/fff?text=Movie+Name";
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded bg-white p-8 shadow-md">
        <h2 className="mb-2 text-xl font-bold">Order Summary</h2>
        <p className="">Order Total: $22</p>
        <div className="mb-2 flex grid items-center justify-center border border-black bg-gray-100 text-center">
          <div className="my-20px">
            <h2 className="mt-2 text-black">Movie Name</h2>
            <h2 className="text-black">Showtime: 10:50 Monday 2/19/2023</h2>
            <h2 className="text-black">$10 Child Ticket</h2>
            <button className="mb-2 rounded  bg-red-500 px-4 font-bold text-white hover:bg-red-700">
              Delete Ticket
            </button>
          </div>
        </div>
        <div className="mb-2 flex grid items-center justify-center border border-black bg-gray-100 text-center">
          <div className="my-20px">
            <h2 className="mt-2 text-black">Movie Name</h2>
            <h2 className="text-black">Showtime: 10:50 Monday 2/19/2023</h2>
            <h2 className="text-black">$10 Child Ticket</h2>
            <button className="mb-2 rounded  bg-red-500 px-4 font-bold text-white hover:bg-red-700">
              Delete Ticket
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="mx-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
            Update Order
          </button>
          <button className="mx-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
            Confirm Order And Continue To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default orderSummary;
