import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../utils/api";

const ConfirmRegistration = () => {
  const router = useRouter();
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const { userID } = router.query;

  // WANT TO PUT EMAIL ON THE PAGE BUT ITS HARD. IGNORING FOR NOW
  // let email: string = '';
  // const [email, setEmail] = useState<string | undefined>(undefined);
  // if (typeof userID === "string") { // I dont know a way around this string thing
  //   const result = api.user.byId.useQuery({id: userID});
  //   // email = result.data?.email || '';
  //   setEmail(result.data?.email);
  // }

  const ValidateRegistration = () => {
    const validateUser = api.activateUser.activate.useMutation();

    useEffect(() => {
      if (typeof userID === "string") { // ensure that type is a string before trying to call the activate function.
        validateUser.mutate({
          userID,
        });
      }
    }, [userID]);

    return <h1></h1>;
  };

  const handleRegistrationConfirmation = () => {
    setShowValidationMessage(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold">{showValidationMessage ? "Thank you!" : "Confirm Email"}</h2>
        {showValidationMessage ? (
          <p className="mb-4">
            Thank you for confirming your cinema ebooking account!
          </p>
        ) : (
          <>
            {/* {isLoading && <p>Loading...</p>}  SEEN THIS ERROR HANDLIGN I JUST DONT KNOW HOW TO DO IT*/}
            {/* {isError && <p>Error: Unable to load email</p>} */}
            {/* {email && ( */}
              <p className="mb-4">
                Please validate your email by clicking the button below.
                Ignore this message if you recieved the email by mistake.
              </p>
             {/* )}  */}
          </>
        )}
        {showValidationMessage && <ValidateRegistration />}
        {!showValidationMessage && (
          <button
            onClick={handleRegistrationConfirmation}
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Confirm Registration
          </button>
        )}
        {showValidationMessage && (
          <button
            onClick={() => router.push("/signIn")}
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Continue to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmRegistration;
