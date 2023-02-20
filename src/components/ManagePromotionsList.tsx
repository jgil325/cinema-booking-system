import React, { useState } from "react";
import PromoCard from "./PromoCard";

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
                <PromoCard/>
            </div>
            <div className="my-8">
                <PromoCard/>
            </div>
            <div className="my-8">
                <PromoCard/>
            </div>
        </form>
    )
}

export default ManagePromotionsList;