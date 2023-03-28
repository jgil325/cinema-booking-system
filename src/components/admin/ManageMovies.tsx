import React from "react";

const ManageMovies = () => {
  const movies = [{ title: "shrek" }, { title: "shrek" }]; // GET ALL MOVIES

  return (
    <div className="grid grow grid-cols-3">
      {/* Movie List */}
      <div className="space-y-2">
        <span className="text-xl font-medium">Movies</span>
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full table-auto divide-y divide-x divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Cast
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Director
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Producer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Synopsis
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
                      {movie.cast}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.director}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.producer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {movie.synopsis}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modify Movie Or Create New Movie Form */}
      <div>
        <span className="text-xl font-medium">Modify Movie / Create Movie</span>
      </div>
      <div>
        <span className="text-xl font-medium">Schedule Movie</span>
      </div>
    </div>
  );
};

export default ManageMovies;
