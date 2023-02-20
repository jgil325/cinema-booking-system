import React, { useState } from "react";
import MovieCard from "./MovieCard";

const testmovie = {
    title: "Shrek",
    categories: ["Action", "Drama"],
    cast: ["Actor1", "Actor2", "Actor3"],
    director: "Director Name",
    producer: "Producer Name",
    synopsis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    reviews: [],
    trailerPicture: "https://img.nbc.com/sites/nbcunbc/files/images/2020/11/03/02b2cc2f-ba71-3a3c-a274-c2e4bd14cd74.jpg",
    trailerVideoId: "W37DlG1i61s",
    MPAAUSFilmRating: "PG",
    showDates: [],
    showTimes: [],
  };

interface ManageMoviesList {
    onSubmit: (movieName: string) => void;
}

const ManageMoviesList: React.FC<ManageMoviesList> = ({ onSubmit }) => {
    const [movieName, setMovieName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // NEEDS LOTS OF PROPER ERROR HANDLING AND ONLY PATCH CHANGED FIELDS
    
        onSubmit(movieName);
    };

    return (
        <form className="rounded-lg bg-white p-20 shadow-md" onSubmit={handleSubmit}>
            <label className="block text-center text-xl font-medium text-gray-700">
                MANAGE MOVIES
            </label>
            <div className="my-8">
                <MovieCard
                movie={testmovie}/>
            </div>
            <div className="my-8">
                <MovieCard
                movie={testmovie}/>
            </div>
            <div className="my-8">
                <MovieCard
                movie={testmovie}/>
            </div>
        </form>
    )
}

export default ManageMoviesList;