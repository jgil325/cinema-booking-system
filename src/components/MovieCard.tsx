import React, { useRef, useState } from "react";
import Modal from "react-modal";
import BookTicketForm from "./forms/BookTicketForm";
import type { Movie, Show } from "@prisma/client";
import { Root, Trigger, Portal, Content } from "@radix-ui/react-popover";

const MovieCard = ({
  movie,
  shows,
}: {
  movie: Movie;
  shows: Array<Show> | undefined;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const modalParentRef = useRef<HTMLDivElement>(null);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  function formatShowings() {}

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxHeight: "90vh",
      maxWidth: "70%",
    },
  };

  return (
    <div
      ref={modalParentRef}
      id="refrefref"
      className="w-[384px] overflow-hidden rounded-lg border border-black shadow-xl hover:shadow-xl hover:shadow-blue-500/50"
    >
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
      <div className="relative min-h-[40px] bg-zinc-100 pt-5">
        <h3 className="mx-3 min-h-[70px] text-3xl font-semibold tracking-tight text-black">
          {movie.title}
        </h3>
        <h6 className="m-3 text-lg font-semibold tracking-tight text-slate-600">
          {movie.rating}
        </h6>
        {shows && shows.length > 0 && (
          <button
            className="relative top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400"
            onClick={openModal}
          >
            Book a ticket
          </button>
        )}
        <Root>
          <Trigger asChild>
            <button
              className="relative top-0 right-0 my-3.5 mx-4 rounded border border-black bg-zinc-200 px-3 py-1 hover:bg-zinc-400"
              onClick={toggleExpansion}
            >
              {isExpanded ? "Hide details" : "Show details"}
            </button>
          </Trigger>
          <Portal>
            <Content>
              <div className="mt-1 w-96 rounded border border-black bg-white px-4 pb-4">
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
                {shows && shows.length > 0 && (
                  <div>
                    <p className="my-2">
                      <strong>Showings:</strong>
                    </p>
                    <div className="grid grid-cols-2">
                      {shows?.map((show) => {
                        return (
                          <div
                            className="font-sm my-1 mx-1 flex justify-between rounded bg-gray-300 px-1 text-sm"
                            key={show.id}
                          >
                            {show.showTime.toLocaleString("en-us", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Content>
          </Portal>
        </Root>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Ticket Modal"
        style={customStyles}
      >
        {shows && (
          <BookTicketForm movie={movie} closeModal={closeModal} shows={shows} />
        )}
      </Modal>
    </div>
  );
};

export default MovieCard;
