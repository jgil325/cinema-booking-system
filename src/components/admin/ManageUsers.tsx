import React from "react";
import { useState } from "react";
import { api } from "../../utils/api";

const ManageUsers = () => {
  const [email, setEmail] = useState('')
  const suspend = api.manageUsers.suspendUser.useMutation()
  const unSuspend = api.manageUsers.unsuspendUser.useMutation()

  const handleSuspend = async() => {
    console.log(email)
    await suspend.mutateAsync({ email: email })
    alert(`${email} has been suspended!`)
  }

  const handleUnsuspend = async() => {
    console.log(email)
    await unSuspend.mutateAsync({ email: email })
    alert(`${email} has been unsuspended!`)
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="username"
        >
          User Email
        </label>
        <input
          className="w-60 rounded-lg border border-gray-400 p-2"
          type="text"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      
      <button
        className="w-60 rounded-lg bg-red-700 py-2 px-4 font-medium text-white"
        onClick={handleSuspend}
      >
        Suspend
      </button>
      <button
        className="w-60 ml-8 rounded-lg bg-green-500 py-2 px-4 font-medium text-white"
        onClick={handleUnsuspend}
      >
        Unsuspend
      </button>
    </div>
  );
};

export default ManageUsers;
