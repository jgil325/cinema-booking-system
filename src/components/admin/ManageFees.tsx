import React from "react";
import { useState, type InputHTMLAttributes, useEffect } from "react";
import { api } from "../../utils/api";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    title?: string;
}

const InputField = ({ title, ...props }: InputFieldProps) => {
    return (
      <div className="grid">
        <span className="text-left font-medium">{title}</span>
        <label>$  
            <input
            className="ml-2 rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id={title}
            {...props}
            />
        </label>
      </div>
    );
};

const ManageFees = () => {
    const {data: fees, refetch: refetchFees} = api.fees.getAllFees.useQuery();
    const updateFees = api.fees.updateFees.useMutation();

    const [booking, setBooking] = useState(fees?.bookingFee);
    const [adult, setAdult] = useState(fees?.adultFee);
    const [child, setChild] = useState(fees?.childFee);
    const [senior, setSenior] = useState(fees?.seniorFee);

    // solution for undefined states with subtle refetch
    const refetch = async() => {
        const fees = await refetchFees();
        setBooking(fees.data?.bookingFee)
        setAdult(fees.data?.adultFee)
        setChild(fees.data?.childFee)
        setSenior(fees.data?.seniorFee)
    }

    if (!booking) {
        refetch()
    }

    const handleSubmit = async() => {
        console.log(booking)
        console.log(adult)
        console.log(child)
        console.log(senior)
        try {
            const updated = await updateFees.mutateAsync(
                { bookingFee: booking || 0, adultFee: adult || 0, childFee: child || 0, seniorFee: senior || 0 }
            )
            console.log(updated)
            alert('Successfully updated booking/ticket fees!')
        } catch (err) {
            console.log(err)
            alert('Error updating fees, try again.')
        }
    }

    return (
        <div>
            <span className="text-xl font-medium">Booking/Ticket Fees Manager</span>
            <div className="flex justify-center mt-6">
                <div>
                    <div className="mb-6">
                        <InputField
                            title={"Booking Fee"}
                            defaultValue={fees?.bookingFee}
                            type="number"
                            onChange={(e) => {setBooking(e.target.valueAsNumber)}}
                        />
                    </div>
                    <div className="mb-6">
                        <InputField
                            title={"Adult Ticket Fee"}
                            defaultValue={fees?.adultFee}
                            type="number"
                            onChange={(e) => {setAdult(e.target.valueAsNumber)}}
                        />
                    </div>
                    <div className="mb-6">
                        <InputField
                            title={"Child Ticket Fee"}
                            defaultValue={fees?.childFee}
                            type="number"
                            onChange={(e) => {setChild(e.target.valueAsNumber)}}
                        />
                    </div>
                    <div className="mb-6">
                        <InputField
                            title={"Senior Ticket Fee"}
                            defaultValue={fees?.seniorFee}
                            type="number"
                            onChange={(e) => {setSenior(e.target.valueAsNumber)}}
                        />
                    </div>
                    <button onClick={handleSubmit} className="text-white bg-indigo-700 hover:bg-indigo-400 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Update Fees</button>
                </div>
            </div>
        </div>
    );
};

export default ManageFees;
