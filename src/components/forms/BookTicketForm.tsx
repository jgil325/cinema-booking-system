import React, { useState } from "react";
import { api } from "../../utils/api";

interface Props {
  movie: {
    title: string;
    MPAAUSFilmRating: string;
    // Add any other properties from the movie object that you need
  };
}

const BookTicketForm: React.FC<Props> = ({ movie }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState(1);

  const createBooking = api.booking.bookTickets.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // These are hard coded right now but will need to be changed.
    const seats = [{ seatInShow: "1", seatNumber: "0" }];
    const showId = "088e0395-147b-47ac-a327-9a23e135029c"; // The showing will need to be passed into the booking form
  
    let result;
    try {
      result = createBooking.mutateAsync({
        seats,
        showId,
      });
      console.log(result)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      <h2 className="mb-4 text-2xl font-semibold">
        Book a ticket for {movie.title}
      </h2>
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block font-semibold">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded border border-gray-400 py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-gray-400 py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="seats" className="mb-2 block font-semibold">
          Number of seats
        </label>
        <input
          id="seats"
          type="number"
          value={seats}
          onChange={(event) => setSeats(Number(event.target.value))}
          className="w-full rounded border border-gray-400 py-2 px-3"
          min={1}
          max={10}
          required
        />
      </div>
      <button
        type="submit"
        className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
      >
        Book {seats} seat(s)
      </button>
    </form>
  );
};

export default BookTicketForm;
