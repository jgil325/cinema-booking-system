import type { Ticket } from "@prisma/client";
import React from "react";

const BookAndPay = ({ tickets }: { tickets: Ticket[] }) => {
  return (
    <div>
      <h1 className="text-center font-bold">Book And Pay</h1>

      <table className="w-full table-fixed">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="w-1/3 py-2">Seat Number</th>
            <th className="w-1/3 py-2">Ticket Type</th>
            <th className="w-1/3 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="py-2 text-center">{ticket.seatNumber}</td>
              <td className="py-2 text-center">{ticket.type}</td>
              <td className="py-2 text-center">${ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookAndPay;
