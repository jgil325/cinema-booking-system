import React, { useState } from "react";
import { api } from "../../utils/api";
import { TicketType } from "@prisma/client";
import Link from "next/link";

interface Props {
  movie: {
    title: string;
    MPAAUSFilmRating: string;
    // Add any other properties from the movie object that you need
  };
}
const tempShows = ['temp1', 'temp2', 'temp3']
const BookTicketForm: React.FC<Props> = ({ movie, showings }) => {
  // make sure showing id passed
  var formattedShowings = []
  for (var shows of showings) {
    formattedShowings.push((shows.toString()).split('G')[0])
  }
  const [show, setShow] = useState(formattedShowings[0]);
  const [seats, setSeats] = useState(1);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Most likely going to push to next page
    console.log(`show: ${show}      seats: ${seats}`)
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      <h2 className="mb-4 text-2xl font-semibold">
        Book a Ticket For {movie.title}
      </h2>
      <div className="grid my-3">
          <span className="text-left font-medium">Choose a Showing</span>
          <select
            value={show}
            onChange={(event) => setShow(event.target.value)}
            className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {formattedShowings.map((show) => (
              <option key={show}>{show}</option>
            ))}
          </select>
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
      <Link href={"/orderHistory"}> // pass show id thru link
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
        >
          Book {seats} seat(s)
        </button>
      </Link>
    </form>
  );
};

export default BookTicketForm;
