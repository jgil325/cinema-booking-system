import React, { useState, useEffect } from "react";
import ManageMoviesForm from "../components/forms/ManageMoviesForm";
import ManageMoviesList from "../components/ManageMoviesList";
import ManagePromotionsForm from "../components/forms/ManagePromotionsForm";
import ManagePromotionsList from "../components/ManagePromotionsList";


// NONE OF THE SUBMISSION HANDLERS WORK NOR ARE CONNECTED YET
function MoviesToggle(props : any) {
  return (
    <div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" onClick={props.handleClick} className="sr-only peer"/>
        <div 
        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full 
        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
        peer-checked:bg-blue-600">
        </div>
      </label>
    </div>
  );
}

const Admin = () => {
  const [isViewMovies, setIsViewMovies] = useState(true);

  function handleClick() {
    setIsViewMovies(!isViewMovies)
  }

  const handleSubmit = (movieName: string) => {
    console.log(`Submitting new movie:`);
    console.log(`Movie Name: ${movieName}`);
    // Perform actual login logic here
  };

  useEffect(() => setIsViewMovies(true), [])
  return (
    <div>
      <div className='flex flex-col items-center mt-6 gap-5'>
        <div className='px-48 py-8 bg-indigo-500 rounded-3xl shadow-lg flex flex-row'>
          <h1 className='font-semibold text-2xl text-white mr-8'>Admin Movies/Promotions Manager</h1>
        </div>
        <MoviesToggle handleClick={handleClick}/>
        {isViewMovies ?
          <div className="flex flex-row gap-2">
            <ManageMoviesList onSubmit={handleSubmit}/>
            <ManageMoviesForm onSubmit={handleSubmit}/> 
          </div> :
          <div className="flex flex-row gap-6">
            <ManagePromotionsList onSubmit={handleSubmit}/>
            <ManagePromotionsForm onSubmit={handleSubmit}/>
          </div>
        }
      </div>
    </div>
  );
};

export default Admin;
