import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import BookTicketForm from "./forms/BookTicketForm";

const MovieCard = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
        <button
          className="absolute top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400"
          onClick={openModal}
        >
          Book a ticket
        </button>
      </div>
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
