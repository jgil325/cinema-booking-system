import React, { useState } from "react";
import { api } from "../utils/api";
import { z } from 'zod'
import Link from "next/link";
import { useSession } from "next-auth/react";

//const bookings = []
/*const bookings = [
    {
        bookingNum:'BookingNum',
        bookingTitle:'Movie Title',
        bookingDate:'MovieDate',
        bookingTickets:'Num of Tickets',
        bookingPrice:'Price Paid',
        bookingCard:'Card Type Used'
    },
    {
        bookingNum:'BookingNum',
        bookingTitle:'Movie Title',
        bookingDate:'MovieDate',
        bookingTickets:'Num of Tickets',
        bookingPrice:'Price Paid',
        bookingCard:'Card Type Used'
    }
]
const bookingsExist = bookings.length > 0*/

const OrderHistory = () => {

    const { data: session } = useSession();
    const getAllUserBookings = api.booking.getAllUserBookings.useQuery({ userID: session?.user.id || ''})
    
    //console.log(getAllUserBookings.data)
    const bookings = getAllUserBookings.data
    const bookingsExist = bookings?.length
    
    console.log(bookings)

    return (
        <div>
            {bookingsExist ? (
              <div className="space-y-2 text-center mt-2">
                <span className="text-xl font-medium">Your Bookings</span>
        
                <div className="mx-4 overflow-y-scroll rounded-lg border">
                  <table className="min-w-full table-auto divide-y divide-x divide-gray-200 text-left ">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Booking Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Date/Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Ticket Number(s)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Order Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Payment Card Used
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => {
                        return (
                          <tr>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {booking.id}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {booking.showTitle}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {(booking.showDate.toString()).split('G')[0]}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {"ticket id"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {`$${booking.totalPrice}`}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                              {'************'+(booking.cardNumber).substring(12)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
                <div className="h-screen flex text-center">
                    <div className="m-auto">
                        <h1 className="text-xl font-medium">No Bookings Found</h1>
                        <p>Browse Showings and Book a Ticket Now!</p>
                            <Link href={"/"}>
                                <button className="my-4 rounded bg-indigo-500 py-2 px-4 font-bold text-white hover:bg-sky-200">
                                    Browse Showings
                                </button>
                            </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderHistory;