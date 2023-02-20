import React, { useState } from "react";
import PromoCard from "./PromoCard";
import { faTrashCan as Trash } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ManagePromotionsList {
    onSubmit: (movieName: string) => void;
}

const ManagePromotionsList: React.FC<ManagePromotionsList> = ({ onSubmit }) => {

    return (
        <form className="rounded-lg bg-white p-20 shadow-md">
            <label className="block text-center text-xl font-medium text-gray-700">
                MANAGE PROMOTIONS
            </label>
            <div className="my-8">
                <button disabled={true}>
                    <FontAwesomeIcon icon={Trash} size="2xl" className=''></FontAwesomeIcon>
                </button>
                <PromoCard/>
            </div>
            <div className="my-8">
                <button disabled={true}>
                    <FontAwesomeIcon icon={Trash} size="2xl" className=''></FontAwesomeIcon>
                </button>
                <PromoCard/>
            </div>
            <div className="my-8">
                <button disabled={true}>
                    <FontAwesomeIcon icon={Trash} size="2xl" className=''></FontAwesomeIcon>
                </button>
                <PromoCard/>
            </div>
        </form>
    )
}

export default ManagePromotionsList;