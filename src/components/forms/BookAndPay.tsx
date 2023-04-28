import type { Ticket } from "@prisma/client";
import React, { useState } from "react";
import { api } from "../../utils/api";

const BookAndPay = ({ tickets }: { tickets: Ticket[] }) => {
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const { data: cards } = api.paymentCard.byId.useQuery();

  const handlePaymentCardNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentCardNumber(event.target.value);
  };

  const handlePromoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPromoCode(event.target.value);
  };

  const handlePayNowClick = () => {
    // TODO: handle payment logic here
  };

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
      {cards && cards.length > 0 && (
        <div className="mt-4">
          <span className="font-medium">
            Use one of your already existing cards
          </span>

          <div className="flex">
            {cards.map((card) => {
              return (
                <button
                  className="rounded border bg-gray-300 px-1"
                  key={card.id}
                >
                  Card Ending In {card.cardNumber.slice(-4)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <label htmlFor="paymentCardNumber" className="block font-bold">
          Payment Card Number
        </label>
        <input
          type="text"
          id="paymentCardNumber"
          value={paymentCardNumber}
          onChange={handlePaymentCardNumberChange}
          className="w-full rounded-md border border-gray-400 p-2"
        />
      </div>

      <div className="mt-8">
        <label htmlFor="promoCode" className="block font-bold">
          Promo Code (optional)
        </label>
        <input
          type="text"
          id="promoCode"
          value={promoCode}
          onChange={handlePromoCodeChange}
          className="w-full rounded-md border border-gray-400 p-2"
        />
      </div>

      <button
        onClick={handlePayNowClick}
        className="mt-8 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default BookAndPay;
