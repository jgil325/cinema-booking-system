import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const testmovie = {
    title: "Movie Title",
    categories: ["Action", "Drama"],
    cast: ["Actor1", "Actor2", "Actor3"],
    director: "Director Name",
    producer: "Producer Name",
    synopsis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reviews: [],
    trailerPicture: "https://via.placeholder.com/1920x1080.png",
    trailerVideoId: "CwXOrWvPBPk",
    MPAAUSFilmRating: "PG-13",
    showDates: [],
    showTimes: [],
  };
  const movies = new Array(10).fill(testmovie);
  const categories = [
    "Currently Showing",
    "Coming Soon",
    "Drama",
    "Comedy",
    "Action",
    "Fantasy",
    "Horror",
    "Romance",
    "Western",
  ];

  return (
    <>
      <Head>
        <title>Cinema EBooking System</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white">
        <div className="mx-64 mt-8 grid grid-cols-12 gap-8 ">
          <input
            className="col-span-3 rounded border border-black"
            placeholder="Search Movies"
          />
          {categories.map((category) => {
            return (
              <button
                className={`rounded-full  bg-cyan-300 hover:bg-cyan-500`}
                key={category}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mx-64 mt-8 grid grid-cols-4 gap-8">
          {movies.map((movie, index) => {
            return (
              <div
                key={`${movie.title} card-${index}`}
                className="rounded border border-black bg-zinc-200 shadow-xl hover:shadow-xl hover:shadow-blue-500/50"
              >
                <div className="grid-rows-3">
                  <div className="aspect-w-16 aspect-h-9 flex justify-center">
                    <iframe
                      src={`https://www.youtube.com/embed/${movie.trailerVideoId}/?modestbranding=1`}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>

                  <div>{movie.title}</div>
                  <div>{movie.MPAAUSFilmRating}</div>
                  <div>
                    <button className="border border-black hover:bg-white bg-zinc-100">Book Movie</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
