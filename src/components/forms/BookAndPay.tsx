import type { Ticket } from "@prisma/client";
import React from "react";

const BookAndPay = ({ tickets }: { tickets: Ticket[] }) => {
  return (
    <div>
      <h1 className="text-center font-bold">Book And Pay</h1>

      <div className="grid grid-cols-3 text-left">
        <span className="pr-2">Seat Number</span>
        <span className="pr-2">Ticket Type</span>
        <span className="pr-2">Price</span>
        {tickets.map((ticket) => {
          return (
            <>
              <span>{ticket.seatNumber}</span>
              <span>{ticket.type}</span>
              <span>${ticket.price}</span>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default BookAndPay;
