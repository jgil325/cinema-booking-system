import { Movie } from "@prisma/client";
import React, { useState } from "react";
import { api } from "../../utils/api";
import MovieForm from "../forms/MovieForm";

const ManageMovies = () => {
  const { data: movies, refetch: refetchMovies } =
    api.movies.getAllMovies.useQuery();

  const { mutate: createMovie } = api.movies.createMovie.useMutation({
    onSuccess: (res) => {
      movies?.push(res);
    },
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>(
    undefined
  );

  const handleSubmit = (movie: Movie) => {
    createMovie(movie);
  };
  return (
    <div className="grid h-[40rem] grow grid-cols-3">
      <div className="space-y-2">
        <span className="text-xl font-medium">Add New Movie</span>
        <div className="a-start mx-4 flex flex-col rounded-lg border px-4">
          <MovieForm onSubmit={handleSubmit} />
        </div>
      </div>
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
              {movies?.map((movie) => {
                return (
                  <tr
                    className={`hover:bg-gray-100 ${
                      selectedMovie?.id === movie.id ? "bg-gray-100" : ""
                    }`}
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                    }}
                  >
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

      <div className="space-y-2">
        <span className="text-xl font-medium">
          Schedule Movie {selectedMovie?.title}
        </span>
        
      </div>
    </div>
  );
};

export default ManageMovies;
