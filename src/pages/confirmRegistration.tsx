import React, { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import Link from "next/link";

const ConfirmRegistration = () => {
  const router = useRouter();

  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const { userID } = router.query;
  const { isLoading, error, data } = api.activateUser.activate.useQuery({
    userID,
  });

  if (isLoading) return null;
  if (error)
    return (
      <div>
        Something Went Wrong<div>{JSON.stringify(error)}</div>
      </div>
    );

  if (!data) return <div>Something Went Wrong</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold">
          {showValidationMessage ? "Thank you!" : "Confirm Email"}
        </h2>
        <p className="mb-4">
          Thank you for confirming your cinema ebooking account!
        </p>
        <Link href="/signIn">
          <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
            Continue to Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
