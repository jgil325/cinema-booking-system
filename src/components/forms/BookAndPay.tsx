import {  type Ticket } from "@prisma/client";
import React, { useState } from "react";
import { api } from "../../utils/api";

const BookAndPay = ({ tickets }: { tickets: Ticket[] }) => {
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const { data: cards } = api.paymentCard.byId.useQuery();
  const { mutate, data: booking } = api.booking.bookAndPay.useMutation();
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
    mutate({ tickets, paymentCardNumber, promoCode });
  };

  if (booking) {
    console.log(booking.booking.showDate);
    return (
      <div className="grid">
        <h1 className="text-xl font-bold">
          Successfully Purchased Tickets for {booking.booking.showTitle} on{" "}
          {booking.booking.showDate.toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h1>
        <div>Email send to {booking.email}</div>
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
        <div>Total Price of Tickets: {booking?.booking?.ticketTotal}</div>

        <div>Tax: {booking?.booking?.tax}</div>
        {booking?.booking?.promoDiscount > 0 && (
          <div>PromoDiscount: -{booking?.booking?.promoDiscount}</div>
        )}
        <div>TotalPrice: {booking?.booking?.totalPrice}</div>
      </div>
    );
  }
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
                  onClick={() => setPaymentCardNumber(card.cardNumber)}
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
