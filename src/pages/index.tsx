import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

import MovieCard from "../components/MovieCard";

const Home: NextPage = () => {
  const testmovie = {
    title: "Shrek",
    categories: ["Action", "Drama"],
    cast: ["Actor1", "Actor2", "Actor3"],
    director: "Director Name",
    producer: "Producer Name",
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
  const movies = new Array(3).fill(testmovie);
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
        <div className="mx-64 mt-10 font-bold">Now Showing</div>
        <div className="mx-64 mt-8 grid grid-cols-3 gap-8">
          {movies.map((movie, index) => {
            return (
              <MovieCard
                movie={movie}
                key={`MovieCard-${index}-${movie.title}`}
              />
            );
          })}
        </div>
        <div className="mx-64 mt-10 font-bold">Coming Soon</div>
        <div className="mx-64 mt-8 grid grid-cols-3 gap-8">
          {movies.map((movie, index) => {
            return (
              <MovieCard
                movie={movie}
                key={`MovieCard-${index}-${movie.title}`}
              />
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
