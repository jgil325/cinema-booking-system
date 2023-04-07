import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import BookTicketForm from "./forms/BookTicketForm";

const MovieCard = ({ movie, showings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(showings)

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  function formatShowings() {
    var formattedString = ''
    for (var show of showings) {
      formattedString += (show.toString()).split('G')[0]+'  •  '
    }
    return formattedString;
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      maxHeight: "90vh",
    },
  };

  return (
    <div className="w-[384px] overflow-hidden rounded-lg border border-black shadow-xl hover:shadow-xl hover:shadow-blue-500/50">
      <div className="relative min-h-[216px] overflow-hidden border-b-2 border-black">
        <iframe
          src={`https://www.youtube.com/embed/${movie.trailerURL}/?modestbranding=1`}
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
        <h6 className="m-3 text-lg font-semibold tracking-tight text-slate-600">
          {movie.rating}
        </h6>
        {isExpanded && <button
          className="relative top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400"
          onClick={openModal}
        >
          Book a ticket
        </button>}
        <button
          className="relative top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400"
          onClick={toggleExpansion}
        >
          {isExpanded ? "Hide details" : "Show details"}
        </button>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4">
          <p className="my-2">
            <strong>Category:</strong> {movie.category}
          </p>
          <p className="my-2">
            <strong>Rating:</strong> {movie.rating}
          </p>
          <p className="my-2">
            <strong>Cast:</strong> {movie.cast}
          </p>
          <p className="my-2">
            <strong>Director:</strong> {movie.director}
          </p>
          <p className="my-2">
            <strong>Producer:</strong> {movie.producer}
          </p>
          <p className="my-2">
            <strong>Synopsis:</strong> {movie.synopsis}
          </p>
          {showings.length != 0  && <p className="my-2">
            <strong>Showings:</strong> {formatShowings()}
          </p>}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Ticket Modal"
        style={customStyles}
      >
        <BookTicketForm movie={movie} closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default MovieCard;
