import React, { useState } from "react";
import Image from "next/image";
const MovieCard = ({ movie }) => {
  return (
    <div className="w-[384px] rounded-lg border border-black shadow-xl hover:shadow-xl hover:shadow-blue-500/50 overflow-hidden">
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
        <div className="absolute top-0 right-0 my-3.5 mx-4 rounded border border-black px-3 py-1 bg-zinc-200 hover:bg-zinc-400">
          <h3 className="text-2xl tracking-tight text-black">Book a ticket</h3>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
