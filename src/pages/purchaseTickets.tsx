import Head from "next/head";
import React from "react";
import MovieCard from "../components/MovieCard";
import DropDownMenu from "../components/ui/DropDownMenu";

const purchaseTickets = () => {
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
  const movies = new Array(10).fill(testmovie);
  const showTimes = new Array(10).fill({
    showTime: "18:00",
    seatsRemaining: Math.floor(Math.random() * 10),
  });
  
  return (
    <>
      <Head>
        <title>Purchase Tickets</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  grid grid-cols-1  gap-4 bg-white">
        <div className="text-center text-6xl font-bold">
          <h1>Purchase Tickets</h1>
        </div>
        <div className="relative mx-16 grid max-h-[500px] rounded border border-black bg-slate-300 py-2 hover:bg-slate-400">
          <DropDownMenu
            shownContent={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 330 330"
                  className="absolute top-2 left-3"
                >
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </svg>
                <h3 className="text-center text-2xl font-medium">
                  Select a movie
                </h3>
              </>
            }
            hiddenContent={
              <div className="overflow-y-scroll">
                <div className="mx-64 mt-8 grid grid-cols-12 gap-8 ">
                  <input
                    className="col-span-3 rounded border border-black"
                    placeholder="Search Movies"
                  />
                </div>
                <div className="mx-64 mt-8 grid grid-cols-3 gap-8 ">
                  {movies.map((movie, index) => {
                    return (
                      <MovieCard
                        movie={movie}
                        key={`MovieCard-${index}-${movie.title}`}
                      />
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
        <div className="relative mx-16 grid max-h-[500px] rounded border border-black bg-slate-300 py-2 hover:bg-slate-400">
          <DropDownMenu
            shownContent={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 330 330"
                  className="absolute top-2 left-3"
                >
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </svg>
                <h3 className="text-center text-2xl font-medium">
                  Select a showtime
                </h3>
              </>
            }
            hiddenContent={
              <div className="relative overflow-x-auto">
                <table className="text-md text-left text-gray-500">
                  <thead className="text-md uppercase text-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Show Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Seats Remaining
                      </th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {showTimes.map((time) => {
                      return (
                        <tr key={time.showTime} className="border-b bg-white ">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900"
                          >
                            {time.showTime}
                          </th>
                          <td className="px-6 py-4 font-medium  text-gray-900">
                            {time.seatsRemaining}
                          </td>
                          <td className="rounded border bg-orange-100  px-6 py-4 font-medium text-gray-900">
                            <button>Select</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            }
          />
        </div>
        <div className="relative mx-16 grid max-h-[500px] rounded border border-black bg-slate-300 py-2 hover:bg-slate-400">
          <DropDownMenu
            shownContent={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 330 330"
                  className="absolute top-2 left-3"
                >
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </svg>
                <h3 className="text-center text-2xl font-medium">
                  Select seats
                </h3>
              </>
            }
            hiddenContent={
              <div className="overflow-y-scroll">
                <div className="mx-64 mt-8 grid grid-cols-12 gap-8 ">
                  <input
                    className="col-span-3 rounded border border-black"
                    placeholder="Search Movies"
                  />
                </div>
                <div className="mx-64 mt-8 grid grid-cols-3 gap-8 ">
                  {movies.map((movie, index) => {
                    return (
                      <MovieCard
                        movie={movie}
                        key={`MovieCard-${index}-${movie.title}`}
                      />
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
        <div className="relative mx-16 grid max-h-[500px] rounded border border-black bg-slate-300 py-2 hover:bg-slate-400">
          <DropDownMenu
            shownContent={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  height="30px"
                  width="30px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 330 330"
                  className="absolute top-2 left-3"
                >
                  <path
                    id="XMLID_225_"
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </svg>
                <h3 className="text-center text-2xl font-medium">
                  Select an age for each seat
                </h3>
              </>
            }
            hiddenContent={
              <div className="overflow-y-scroll">
                <div className="mx-64 mt-8 grid grid-cols-12 gap-8 ">
                  <input
                    className="col-span-3 rounded border border-black"
                    placeholder="Search Movies"
                  />
                </div>
                <div className="mx-64 mt-8 grid grid-cols-3 gap-8 ">
                  {movies.map((movie, index) => {
                    return (
                      <MovieCard
                        movie={movie}
                        key={`MovieCard-${index}-${movie.title}`}
                      />
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
      </main>
    </>
  );
};

export default purchaseTickets;
