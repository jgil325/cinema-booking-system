import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { api } from "../utils/api";

import MovieCard from "../components/MovieCard";

const Home: NextPage = () => {
  const { data: movies } = api.movies.getAllMovies.useQuery();
  const { data: showings } = api.showings.getAllShows.useQuery();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const nowShowingMovies = movies?.filter(
    (movie) =>
      movie.status === "CURRENTLYSHOWING" &&
      (movie.title.toLowerCase().includes(searchTerm) ||
        movie.category.toLowerCase().includes(searchTerm))
  );
  const comingSoonMovies = movies?.filter(
    (movie) =>
      movie.status === "COMINGSOON" &&
      (movie.title.toLowerCase().includes(searchTerm) ||
        movie.category.toLowerCase().includes(searchTerm))
  );

  return (
    <>
      <Head>
        <title>Cinema EBooking System</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-20 bg-white">
        <div className="my-8  flex w-full justify-between">
          <div className="pr-5 text-lg font-bold text-gray-800 ">Search:</div>
          <input
            className="grow rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            placeholder="Search Movies"
            onChange={handleSearchTermChange}
          />
        </div>

        {nowShowingMovies?.length === 0 && comingSoonMovies?.length === 0 ? (
          <div className="my-8 text-center text-gray-800">
            No movies match the search criteria.
          </div>
        ) : (
          <>
            {nowShowingMovies?.length > 0 && (
              <>
                <div className="mt-10 text-3xl font-bold">Now Showing</div>
                <div className="mt-8 grid grid-cols-3 gap-8">
                  {nowShowingMovies?.map((movie) => {
                    return (
                      <MovieCard
                        movie={movie}
                        shows={showings?.filter(
                          (show) => show.movieId === movie.id
                        )}
                        key={`MovieCard-${movie.id}`}
                      />
                    );
                  })}
                </div>
              </>
            )}

            {comingSoonMovies?.length > 0 && (
              <>
                <div className="mt-10 text-3xl font-bold">Coming Soon</div>
                <div className="mt-8 grid grid-cols-3 gap-8">
                  {comingSoonMovies?.map((movie) => {
                    return (
                      <MovieCard
                        movie={movie}
                        shows={showings?.filter(
                          (show) => show.movieId === movie.id
                        )}
                        key={`MovieCard-${movie.id}`}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Home;
