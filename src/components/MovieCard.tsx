import React, { useState } from "react";
import Image from "next/image";
const MovieCard = ({ movie }) => {
  return (
    <div className="w-[384px] overflow-hidden rounded-lg border border-black shadow-xl hover:shadow-xl hover:shadow-blue-500/50">
      <div className="relative min-h-[216px] overflow-hidden border-b-2 border-black">
        <iframe
          src={`https://www.youtube.com/embed/${movie.trailerVideoId}/?modestbranding=1`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="object-cover"
          height={216}
          width={384}
        />
      </div>
      <div className="relative min-h-[40px] bg-zinc-100">
        <h3 className="mx-3 text-3xl font-semibold tracking-tight text-black">
          {movie.title}
        </h3>
        <h6 className="mx-3 text-lg font-semibold tracking-tight text-slate-600">
          {movie.MPAAUSFilmRating}
        </h6>
        <button className="absolute top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400">
          Book a ticket
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
