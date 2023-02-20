import React, { useState } from "react";

interface ManageMoviesForm {
    onSubmit: (movieName: string) => void;
}

const movieRatings = ['Select Rating','G','PG','PG-13','R']

function RatingDropDownForm() {
    const [selected, setSelected] = useState(movieRatings[0]);
    return (
      <form>
          <label
            className="mb-2 block font-medium text-gray-700"
            htmlFor="username"
          >
            Rating
          </label>
        <select 
         className="rounded-lg border border-gray-400 px-2 py-2"
         value={selected} 
         onChange={(e) => setSelected(e.target.value)}>
           {movieRatings.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
           ))}
        </select>
      </form>
    );
}

function DatePicker() {
    return (
        <div className="my-4 flex flex-col">
            <label
                className="mb-2 block font-medium text-gray-700"
                htmlFor="username"
                >
                Showing Dates
            </label>
            <div date-rangepicker className="flex items-center">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path 
                            fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd">
                            </path>
                        </svg>
                    </div>
                    <input name="start" type="text" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Select date start">
                    </input>
                </div>
                <span className="mx-4 text-gray-500">to</span>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path 
                            fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd">
                            </path>
                        </svg>
                    </div>
                    <input name="end" type="text" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Select date end">
                    </input>
                </div>
            </div>
        </div>
    );
}

const ManageMoviesForm: React.FC<ManageMoviesForm> = ({ onSubmit }) => {
    const [movieName, setMovieName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // NEEDS LOTS OF PROPER ERROR HANDLING AND ONLY PATCH CHANGED FIELDS
    
        onSubmit(movieName);
    };

    return (
        <form className="rounded-lg bg-white p-20 shadow-md" onSubmit={handleSubmit}>
            <label className="block text-center text-xl font-medium text-gray-700">
                CREATE NEW MOVIE
            </label>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Title
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Category
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Category
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Cast
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-12"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Director
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Producer
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Synopsis
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-12"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Reviews
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-12"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Trailer Picture URL
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Trailer URL
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-2"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <RatingDropDownForm/>
            <DatePicker/>
            <div className="flex justify-center mt-12">
                <button
                    className="rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white hover:bg-indigo-700 shadow-lg"
                    type="submit"
                >
                    ADD LISTING
                </button>
            </div>
        </form>
    )
}

export default ManageMoviesForm;