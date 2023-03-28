import { Movie } from "@prisma/client";
import React, { useState } from "react";
import MovieForm from "../forms/MovieForm";

const ManageMovies = () => {
  const testmovie = {
    title: "Shrek",
    category: ["Action", "Drama"],
    cast: ["Actor1", "Actor2", "Actor3"],
    director: "Andrew Adamson",
    producer: "DreamWorks Pictures",
    synopsis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reviews: [],
    trailerPicture:
      "https://img.nbc.com/sites/nbcunbc/files/images/2020/11/03/02b2cc2f-ba71-3a3c-a274-c2e4bd14cd74.jpg",
    trailerVideoId: "W37DlG1i61s",
    MPAAUSFilmRating: "PG",
    showDates: [],
    showTimes: [],
  };
  const movies = new Array(10).fill(testmovie); // GET ALL MOVIES
  const [selectedMovie, setSelectedMovie] = useState(movies.at(0));

  return (
    <div className="grid h-[40rem] grow grid-cols-3">
      {/* Movie List */}
      <div className="space-y-2">
        <span className="text-xl font-medium">Movies</span>
        <div className="mx-4 overflow-y-scroll rounded-lg border">
          <table className="min-w-full table-auto divide-y divide-x divide-gray-200 text-left ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Director
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Producer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movies.map((movie) => {
                return (
                  <tr className="hover:bg-gray-100" key={movie.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.director}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.producer}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modify Movie Or Create New Movie Form */}
      <div className="space-y-2">
        <span className="text-xl font-medium">Edit Movie</span>
        <div className="a-start mx-4 flex flex-col rounded-lg border px-4">
          <MovieForm movie={selectedMovie as Movie} onSubmit={() => null} />
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-xl font-medium">Schedule Movie</span>
      </div>
    </div>
  );
};

export default ManageMovies;
