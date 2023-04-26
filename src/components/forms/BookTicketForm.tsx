import React, { useState } from "react";
import { api } from "../../utils/api";
import { type Movie, type Seat, type Show, TicketType } from "@prisma/client";

interface Props {
  movie: Movie;
  closeModal: () => void;
  shows: Array<Show>;
}

const BookTicketForm: React.FC<Props> = ({
  movie,
  closeModal,
  shows,
}: Props) => {
  // const {data: showRoom} = api.getShowroom(show)
  const seatsa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
    const out: Seat = {
      seatNumber: num,
      isOccupied: num % 3 === 0,
      doesRecline: false,
      showRoomId: "",
    };
    return out;
  });
  const showRoom = {
    seats: seatsa,
  };

  const [show, setShow] = useState<Show>();
  const [seats, setSeats] = useState<Array<number>>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Most likely going to push to next page
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-semibold">
          Book a ticket for {movie.title}
        </h2>
        <span
          className="h-5 w-5 items-center rounded-xl bg-gray-300 text-center hover:cursor-pointer"
          onClick={closeModal}
        >
          x
        </span>
      </div>

      <div className="w-full">
        <label htmlFor="showtime" className="mb-2 block font-semibold">
          Showtime
        </label>
        <div className="flex w-full flex-wrap space-x-2">
          {shows?.map((theshow) => {
            return (
              <div
                className={`font-sm no-select my-1 rounded px-1 text-sm hover:cursor-pointer ${
                  theshow === show ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
                key={theshow.id}
                onClick={() => setShow(theshow)}
              >
                {theshow.showTime.toLocaleString("en-us", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            );
          })}
        </div>
      </div>
      {show && showRoom.seats.length === 0 && (
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block font-semibold">
            Cannot Book Ticket for this showtime. Showroom has no seats
          </label>
        </div>
      )}
      {show && showRoom.seats && (
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block font-semibold">
            Seat
          </label>
          <div className="flex flex-wrap space-x-1">
            {showRoom.seats.map((seat) => {
              const selected = seats?.includes(seat.seatNumber);
              return (
                <div
                  key={seat.seatNumber}
                  className={`${
                    selected ? "bg-blue-600 text-white" : "bg-gray-300"
                  } w-8 text-center`}
                  onClick={() => {
                    if (!selected)
                      setSeats((prev) => [...prev, seat.seatNumber].sort());
                    else
                      setSeats((prev) =>
                        prev.filter((item) => item !== seat.seatNumber)
                      );
                  }}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {show && showRoom.seats && seats && (
        <div>
          <label htmlFor="email" className="mb-2 block font-semibold">
            Select Ticket Type For Each Seat
          </label>
          {seats.map((seat) => {
            return (
              <div key={seat} className="flex">
                <span>Seat {seat}</span>
                <select className="px-2">
                  {Object.keys(TicketType).map((type) => {
                    return <option key={type}>{type}</option>;
                  })}
                </select>
              </div>
            );
          })}
        </div>
      )}
      <button
        type="submit"
        className="mt-4 rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
      >
        Proceed To Checkout
      </button>
    </form>
  );
};

export default BookTicketForm;
