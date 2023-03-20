// import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";

// NEEDS: Need a page that says basically thank you for signing 

const RegisterForm = () => {
  const router = useRouter();

  // User Account information
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignedUpPromos, setIsPromotionChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); 

  // Payment Account Information
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<"VISA" | "MASTERCARD" | "DISCOVER" | "AMEX">("VISA");
  const [billingAddress, setBillingAddress] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeState, setHomeState] = useState("");
  const [homeZipCode, setHomeZip] = useState("");

  // Render Page Comp
  const [finishedReg, setFinishedReg] = useState(true);

  // Hooks
  const createAccount = api.user.createAccount.useMutation({
    // onSuccess(data) { // DONT FULLY UNDERSTAND THE USE OF THIS
    //   console.log("Test: Account Creation was successful")
    // },
    // onError(error) {
    //   alert("Testing:" + error.message);
    // }
  });
  const createPaymentInfo = api.paymentCard.createPaymentInfo.useMutation();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Password and confirm password must match. Please try again.");
      return;
    }

    try { // Must have these handled here too or is gives a popup error
      const createAccountResult = await createAccount.mutateAsync({
        email,
        firstName,
        lastName,
        password,
        isSignedUpPromos,
        phoneNumber,
      });

      try {
        await createPaymentInfo.mutateAsync({
          cardNumber,
          cardType: cardType,
          billingAddress,
          expirationMonth: Number(expirationMonth),
          expirationYear: Number(expirationYear),
          homeAddress,
          homeCity,
          homeState,
          homeZipCode,
          userId: createAccountResult.id,
          // TODO: CHECK Home Address, City, State, Zip Code
        });
        // Navigate to success page or show success message
        // setFinishedReg(false);
      } catch (error) {
          let errorMessage;
        if (error instanceof TRPCClientError) {
          const errorResult = error.message;
          errorMessage = "Please correct you payment information regarding: \n" + errorResult;
        } else {
          errorMessage = "Server Error: Please try creating your account again."
        }
        alert(errorMessage);
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof TRPCClientError) {
        const errorResult = error.message;
        errorMessage = "Please correct you account information regarding: \n" + errorResult;
      } else {
        errorMessage = "Server Error: Please try creating your account again."
      }
      alert(errorMessage);
    }
  };

  return ( 
    // <div /* Dont know how to feel about this conditional thing*/> 
    //   {!finishedReg ? (
    //     <>
    //       <p className="text-mauve11 mb-5 text-[15px] leading-normal">
    //         Confirmation Email sent. Please confirm email to login.
    //       </p>
    //     </>
    //   ) : (
      <Tabs.Root
        className="flex w-[300px] flex-col rounded-lg bg-white shadow-md"
        defaultValue="tab1"
      >
        <Tabs.List
          className="border-mauve6 flex shrink-0 border-b"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="hover:text-violet11 data-[state=active]:text-violet11 flex 
          h-[45px] flex-1 cursor-default select-none items-center 
          justify-center bg-white px-5 
          text-[15px] leading-none text-gray-700 outline-none 
          first:rounded-tl-md last:rounded-tr-md 
          data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] 
          data-[state=active]:shadow-current 
          data-[state=active]:focus:relative 
          data-[state=active]:focus:shadow-[0_0_0_2px] 
          data-[state=active]:focus:shadow-black"
            value="tab1"
          >
            Account Info
          </Tabs.Trigger>
          <Tabs.Trigger
            className="hover:text-violet11 data-[state=active]:text-violet11
          flex h-[45px] flex-1 
          cursor-default select-none items-center justify-center 
          bg-white px-5 text-[15px] leading-none text-gray-700 
          outline-none first:rounded-tl-md last:rounded-tr-md 
          data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]
            data-[state=active]:shadow-current data-[state=active]:focus:relative 
            data-[state=active]:focus:shadow-[0_0_0_2px] 
            data-[state=active]:focus:shadow-black"
            value="tab2"
          >
            Payment Info
          </Tabs.Trigger>
          <Tabs.Trigger
            className="hover:text-violet11 data-[state=active]:text-violet11
          flex h-[45px] flex-1 
          cursor-default select-none items-center justify-center 
          bg-white px-5 text-[15px] leading-none text-gray-700 
          outline-none first:rounded-tl-md last:rounded-tr-md 
          data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]
            data-[state=active]:shadow-current data-[state=active]:focus:relative 
            data-[state=active]:focus:shadow-[0_0_0_2px] 
            data-[state=active]:focus:shadow-black"
            value="tab3"
          >
            Password
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab1"
        >
          <p className="text-mauve11 mb-5 text-[15px] leading-normal">
            Set your account details here.
          </p>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="name"
            >
              Email
            </label>
            <input // I CHANGED THIS PART 
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="email" // Added value and change
              value={email}
              defaultValue="example@gmail.com"
              onChange={event => setEmail(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="name"
            >
              First Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="firstName" // Added value and change
              value={firstName}
              defaultValue="john"
              onChange={event => setFirstName(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="name"
            >
              Last Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="lastName" // Added value and change
              value={lastName}
              defaultValue="smith"
              onChange={event => setLastName(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="phone" // Added value and change
              value={phoneNumber}
              defaultValue="XXX-XXX-XXXX"
              onChange={event => setPhoneNumber(event.target.value)}
            />
          </fieldset> 
          <fieldset className="mb-[5px] flex w-full flex-row justify-end gap-3">
            <label
                className="text-violet12 mb-2.5 block text-[13px] leading-none pt-2"
                htmlFor="promo"
              >
                Opt in for Promotional Emails
              </label>
              <input
                type="checkbox"
                id="promoID"
                name="promo"
                value=""
                checked={isSignedUpPromos}
                onChange={() => {setIsPromotionChecked(!isSignedUpPromos)}}
              />
          </fieldset>
        </Tabs.Content>
        <Tabs.Content
          className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab2"
        >
          <div>
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-type"
            >
              Card Type
            </label>
            <select 
            className="rounded-lg border border-gray-400 px-2 py-2"
            value={cardType} 
            onChange={event => setCardType(event.target.value as "VISA" | "MASTERCARD" | "DISCOVER" | "AMEX")}
            >
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MASTERCARD</option>
              <option value="DISCOVER">DISCOVER</option>
              <option value="AMEX">AMEX</option>
            </select>
          </div>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-number"
            >
              Card Number
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="cardNumber" // Added value and change
              value={cardNumber}
              defaultValue="VISA"
              onChange={event => setCardNumber(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-exp"
            >
              Expiration Month
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="expirationMonth" // Added value and change
              value={expirationMonth}
              defaultValue="12"
              onChange={event => setExpirationMonth(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-exp"
            >
              Expiration Year
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="expirationYear" // Added value and change
              value={expirationYear}
              defaultValue="23"
              onChange={event => setExpirationYear(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-billing"
            >
              Billing Address
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="billingAddress" // Added value and change
              value={billingAddress}
              defaultValue="124 Conch Street, Bikini Bottom, Pacific Ocean"
              onChange={event => setBillingAddress(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="home-address"
            >
              Home Address
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="homeAddress" // Added value and change
              value={homeAddress}
              defaultValue=""
              onChange={event => setHomeAddress(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="home-city"
            >
              Home City
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home-city"
              value={homeCity}
              defaultValue=""
              onChange={event => setHomeCity(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="home-address"
            >
              Home State
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home-state"
              value={homeState}
              defaultValue=""
              onChange={event => setHomeState(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="home-address"
            >
              Home Zip Code
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home-zip"
              value={homeZipCode}
              defaultValue=""
              onChange={event => setHomeZip(event.target.value)}
            />
          </fieldset>
        </Tabs.Content>
        <Tabs.Content
          className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab3"
        >
          <p className="text-mauve11 mb-5 text-[15px] leading-normal">
            Set your password here.
          </p>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="newPassword"
            >
              Set password
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="password" // Added value and change
              value={password}
              defaultValue=""
              onChange={event => setPassword(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="confirmPassword" // Added value and change
              value={confirmPassword}
              defaultValue=""
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </fieldset>
          <form onSubmit={handleFormSubmit}> 
            <button // ADDED this form
            // onClick={() => router.push("/confirmRegistration")} // TOOK THIS OUT
              className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
              type="submit"
            >
              Create Account
            </button>
          </form>
        </Tabs.Content>
      </Tabs.Root>
      // )}
      // </div> 
    );
};

export default RegisterForm;
