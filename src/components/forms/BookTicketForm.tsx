import React, { useState } from "react";
import { api } from "../../utils/api";
import { type Movie, type Show, TicketType } from "@prisma/client";
import CheckOutForm from "../CheckOutForm";
import BookAndPay from "./BookAndPay";

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
  const [show, setShow] = useState<Show>();
  const [seats, setSeats] = useState<Array<number>>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const { data: showingSeatCount } =
    api.booking.getNumberOfSeatsInShowRoom.useQuery({
      showingId: show?.id || "",
    });

  const { data: occupiedSeats } = api.booking.getOccupiedSeats.useQuery({
    showId: show?.id || "",
  });

  const [seatsWithTicketType, setSeatsWithTicketType] = useState<
    Array<{ seatNumber: number; seatType: TicketType }>
  >([]);

  const { data: showRoomId } = api.booking.getShowRoomIdByShowId.useQuery({
    showingID: show?.id || "",
  });

  const { mutate, data: tickets } = api.booking.reserveTickets.useMutation({
    onSuccess: () => {
      setShowCheckout(true);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (show && showRoomId)
      mutate({ seats: seatsWithTicketType, showId: show?.id, showRoomId });
  };

  if (!showCheckout)
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
                  onClick={() => {
                    setShow(theshow);
                    if (theshow.id !== show?.id) {
                      setSeats([]);
                      setSeatsWithTicketType([]);
                    }
                  }}
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
        {show && showingSeatCount && occupiedSeats && (
          <>
            <label htmlFor="name" className="mb-2 block font-semibold">
              Seat
            </label>
            <div className="mb-4">
              <div className="rounded border  border-black bg-gradient-to-r from-indigo-500 via-purple-500  to-pink-500 py-1 text-center font-bold text-white">
                Screen
              </div>
              <div className="grid grid-cols-10">
                {Array.from(
                  Array(showingSeatCount?.showRoom?.numberOfSeats)
                ).map((seat, index) => {
                  const alreadyBooked = occupiedSeats?.some(
                    (seat) => seat.seatNumber === index
                  );
                  const selected = seats?.includes(index);
                  return (
                    <div
                      key={index}
                      className={`${
                        alreadyBooked
                          ? "bg-gray-500 hover:cursor-not-allowed"
                          : selected
                          ? "bg-blue-600 text-white  hover:cursor-pointer"
                          : "bg-gray-300  hover:cursor-pointer"
                      } my-1 w-8 rounded-t-lg py-2 text-center`}
                      onClick={() => {
                        if (alreadyBooked) return;
                        if (!selected) {
                          setSeats((prev) =>
                            [...prev, index].sort((a, b) => a - b)
                          );
                          setSeatsWithTicketType((prev) => [
                            ...prev,
                            {
                              seatNumber: index,
                              seatType: TicketType.ADULT,
                            },
                          ]);
                        } else {
                          setSeats((prev) =>
                            prev.filter((item) => item !== index)
                          );
                          setSeatsWithTicketType((prev) =>
                            prev.filter((item) => item.seatNumber !== index)
                          );
                        }
                      }}
                    >
                      {index}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
        {show && seats.length > 0 && (
          <>
            <div>
              <label htmlFor="email" className="mb-2 block font-semibold">
                Select Ticket Type For Each Seat
              </label>
              <div className="space-y-1">
                {seatsWithTicketType.map((seat) => {
                  return (
                    <div key={seat.seatNumber} className="flex">
                      <span className="pr-2">Seat {seat.seatNumber}</span>
                      <button
                        className={`${
                          seat.seatType === "ADULT"
                            ? "bg-blue-500 font-medium"
                            : "bg-gray-400"
                        } mx-1 rounded border border-black px-1 `}
                        type="button"
                        onClick={() =>
                          setSeatsWithTicketType((prev) => {
                            const newSeats = prev.map((item) => {
                              if (item.seatNumber !== seat.seatNumber)
                                return item;
                              return {
                                ...item,
                                seatType: "ADULT" as TicketType,
                              };
                            });
                            return newSeats;
                          })
                        }
                      >
                        Adult
                      </button>

                      <button
                        className={`${
                          seat.seatType === "CHILD"
                            ? "bg-blue-500 font-medium"
                            : "bg-gray-400"
                        } mx-1 rounded border border-black px-1 `}
                        type="button"
                        onClick={() =>
                          setSeatsWithTicketType((prev) => {
                            const newSeats = prev.map((item) => {
                              if (item.seatNumber !== seat.seatNumber)
                                return item;
                              return {
                                ...item,
                                seatType: "CHILD" as TicketType,
                              };
                            });
                            return newSeats;
                          })
                        }
                      >
                        Child
                      </button>

                      <button
                        className={`${
                          seat.seatType === "SENIOR"
                            ? "bg-blue-500 font-medium"
                            : "bg-gray-400"
                        } mx-1 rounded border border-black px-1 `}
                        type="button"
                        onClick={() =>
                          setSeatsWithTicketType((prev) => {
                            const newSeats = prev.map((item) => {
                              if (item.seatNumber !== seat.seatNumber)
                                return item;
                              return {
                                ...item,
                                seatType: "SENIOR" as TicketType,
                              };
                            });
                            return newSeats;
                          })
                        }
                      >
                        Senior
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
            >
              Proceed To Checkout
            </button>
          </>
        )}
      </form>
    );
  if (tickets) return <BookAndPay tickets={tickets} />;
};

export default BookTicketForm;
