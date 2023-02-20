import React, { useState } from "react";

interface ManagePromotionsForm {
    onSubmit: (movieName: string) => void;
}

const ManagePromotionsForm: React.FC<ManagePromotionsForm> = ({ onSubmit }) => {
    const [movieName, setMovieName] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // NEEDS LOTS OF PROPER ERROR HANDLING AND ONLY PATCH CHANGED FIELDS
    
        onSubmit(movieName);
    };

    return (
        <form className="rounded-lg bg-white p-20 shadow-md" onSubmit={handleSubmit}>
            <label className="block text-center text-xl font-medium text-gray-700">
                CREATE NEW PROMOTION
            </label>
            <div className="my-4">
                <label className="mb-2 block font-medium text-gray-700" htmlFor="username">
                Promo Title
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
                Promo Body
                </label>
                <input
                className="w-full rounded-lg border border-gray-400 px-12 py-12"
                type="text"
                id="movieName"
                value={movieName}
                onChange={(event) => setMovieName(event.target.value)}
                />
            </div>
            <div className="flex justify-center mt-12">
                <button
                    className="rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white hover:bg-indigo-700 shadow-lg"
                    type="submit"
                >
                    ADD PROMO
                </button>
            </div>
        </form>
    )
}

export default ManagePromotionsForm;