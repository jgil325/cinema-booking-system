import type { Ticket } from "@prisma/client";
import React, { useState } from "react";
import { api } from "../../utils/api";

const BookAndPay = ({ tickets }: { tickets: Ticket[] }) => {
  const getBookingFee = api.fees.getAllFees.useQuery();
  var price = getBookingFee.data?.bookingFee;
  const tax = 1.1;
  var total = price * tax;
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentCardMonth, setPaymentCardMonth] = useState("");
  const [paymentCardYear, setPaymentCardYear] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(total)

  const { data: cards } = api.paymentCard.byId.useQuery();
  const getPromo = api.promos.byCode.useMutation();
  const createBooking = api.booking.bookAndPay.useMutation();
  
  console.log(cards)

  const handlePaymentCardNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentCardNumber(event.target.value);
  };
  const handlePaymentCardMonthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentCardMonth(event.target.value);
  };
  const handlePaymentCardYearChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentCardYear(event.target.value);
  };

  const handlePromoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPromoCode(event.target.value);
  };

  const handlePromoCode = async() => {
    console.log(promoCode)
    try {
      const foundPromo = await getPromo.mutateAsync({ code: promoCode});
      console.log(foundPromo)
      var price = totalPrice;
      setTotalPrice(price * foundPromo.discount)
    } catch {
      alert(`No promo was found by code: ${promoCode}`);
    }
  }

  const setCardDetails = (card) => {
    setPaymentCardNumber(card.cardNumber)
    setPaymentCardMonth(card.expirationMonth)
    setPaymentCardYear(card.expirationYear)
  }

  const handlePayNowClick = async() => {
    try {
      const newBooking = await createBooking.mutateAsync({tickets: tickets, paymentCardNumber: paymentCardNumber})
      console.log(newBooking)
      alert('Successfully created booking!')
    } catch {
      alert('Error creating your booking.')
    }
    
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
                  onClick={() => {setCardDetails(card)}}
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
      <div className="mt-4">
        <label htmlFor="paymentCardNumber" className="block font-bold">
          Payment Card Month
        </label>
        <input
          type="text"
          id="paymentCardNumber"
          value={paymentCardMonth}
          onChange={handlePaymentCardMonthChange}
          className="w-full rounded-md border border-gray-400 p-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="paymentCardNumber" className="block font-bold">
          Payment Card Year
        </label>
        <input
          type="text"
          id="paymentCardNumber"
          value={paymentCardYear}
          onChange={handlePaymentCardYearChange}
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
        onClick={handlePromoCode}
        className="mt-8 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        Enter Promo Code
      </button>

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
