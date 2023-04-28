import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { z, ZodError } from 'zod';
import validator from "validator";

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
  const [cardType, setCardType] = useState<
    "VISA" | "MASTERCARD" | "DISCOVER" | "AMEX"
  >("VISA");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZipCode, setBillingZip] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeState, setHomeState] = useState("");
  const [homeZipCode, setHomeZip] = useState("");

  // Hooks
  const createAccount = api.user.createAccount.useMutation();
  
  const createAccountDetail = z.object({
    // User Validation
    email: z.string().email(),
    firstName: z.string().min(1, { message: "Name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    password: z
      .string()
      .min(8, { message: "Length must be at least 8 characters long." }), // .includes(string) TODO: ensure that password has combination of uppercase, lowercase, and symbols
    isSignedUpPromos: z.boolean(),
    phoneNumber: z
      .string()
      .refine(validator.isMobilePhone, {
        message: "Please enter a valid phone number.",
      }),
    homeAddress: z.string().min(1, { message: "Home address is required" }),
    homeCity: z.string().min(1, { message: "Home city is required" }),
    homeState: z.string().min(1, { message: "Home state is required" }),
    homeZipCode: z
      .string()
      .length(5, { message: "Please enter a valid zip code." }),
    //Payment Validation
    cardNumber: z
      .union([z.string().refine((value) => validator.isCreditCard(value), {
        message: "Please enter a valid credit card number.",
      }), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e),
    cardType: z.enum(["VISA", "MASTERCARD", "DISCOVER", "AMEX"]),
    billingAddress: z
      .union([z.string().max(100), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e),
    expirationMonth: z
      .union([z.number().min(1, { message: "Please enter a valid month." }).max(12, { message: "Please enter a valid month." }), z.number().optional()]),
    expirationYear: z
      .union([z.number().min(1, { message: "Please enter a valid expiration year." }), z.number().optional()]),
    billingCity: z
      .union([z.string().min(1, { message: "Please enter a valid city." }), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e),
    billingState: z
      .union([z.string().min(1), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e),
    billingZipCode: z
      .union([z.string().length(5, { message: "Please enter a valid zip code."}), z.string().length(0)])
      .optional()
      .transform(e => e === "" ? undefined : e),
  })
  .refine((value) => {
    if (
      (!value.cardNumber && !value.billingAddress && !value.expirationMonth && !value.expirationYear && !value.billingCity && !value.billingState && !value.billingZipCode) ||
      (value.cardNumber && value.billingAddress && value.expirationMonth && value.expirationYear && value.billingCity && value.billingState && value.billingZipCode)
    ) {
      return true;
    }
    throw new Error('All payment fields are required if you want to add a payment card. \nPlease remove all data from fields if you do not want to create a payment card.')
  })

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password must match. Please try again.");
      return;
    }
    let createAccountResult;
    try {
      const result = createAccountDetail.parse({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        isSignedUpPromos: isSignedUpPromos,
        phoneNumber: phoneNumber,
        homeAddress: homeAddress,
        homeCity: homeCity,
        homeState: homeState,
        homeZipCode: homeZipCode,
        cardNumber: cardNumber,
        cardType: cardType,
        billingAddress: billingAddress,
        expirationMonth: Number(expirationMonth),
        expirationYear: Number(expirationYear),
        billingCity: billingCity,
        billingState: billingState,
        billingZipCode: billingZipCode,
      })
      createAccountResult = await createAccount.mutateAsync({
        email,
        firstName,
        lastName,
        password,
        isSignedUpPromos,
        phoneNumber,
        homeAddress,
        homeCity,
        homeState,
        homeZipCode,
        cardNumber,
        cardType: cardType,
        billingAddress,
        expirationMonth: Number(expirationMonth),
        expirationYear: Number(expirationYear),
        billingCity,
        billingState,
        billingZipCode,
      });
      // TODO: Navigate to success page or show success message
        router.push("/checkEmail").catch(error => console.error(error));
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((error) => error.message);
        const errorMessage = messages.join("\n");

        alert(`Error : ${errorMessage}`);
      } else if (error instanceof TRPCClientError) {
        console.log(error.message)
        alert('Error: '+error.message)
      } else {
        console.log('Please enter all payment card details.')
        alert('Please enter all payment card details.')
      }
    }
    return createAccountResult;
  };

  return (
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
            onChange={(event) => setEmail(event.target.value)}
          />
        </fieldset>
        <fieldset className="flex w-full flex-row justify-between space-x-3">
          <fieldset className="mb-[15px] flex w-1/2 flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="name"
            >
              First Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="firstName" // Added value and change
              value={firstName}
              defaultValue="john"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-1/2 flex-col ">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="name"
            >
              Last Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="lastName" // Added value and change
              value={lastName}
              defaultValue="smith"
              onChange={(event) => setLastName(event.target.value)}
            />
          </fieldset>
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
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="phone"
          >
            Home Address
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="home address" // Added value and change
            value={homeAddress}
            defaultValue=""
            onChange={(event) => setHomeAddress(event.target.value)}
          />
        </fieldset>
        <fieldset className="flex w-full flex-row justify-between space-x-3">
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="phone"
            >
              Home City
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home city" // Added value and change
              value={homeCity}
              defaultValue=""
              onChange={(event) => setHomeCity(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="phone"
            >
              Home State
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home state" // Added value and change
              value={homeState}
              defaultValue=""
              onChange={(event) => setHomeState(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="phone"
            >
              Home Zip
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home zip code" // Added value and change
              value={homeZipCode}
              defaultValue=""
              onChange={(event) => setHomeZip(event.target.value)}
            />
          </fieldset>
        </fieldset>
        <fieldset className="mb-[5px] flex w-full flex-row justify-end gap-3">
          <label
            className="text-violet12 mb-2.5 block pt-2 text-[13px] leading-none"
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
            onChange={() => {
              setIsPromotionChecked(!isSignedUpPromos);
            }}
          />
        </fieldset>
      </Tabs.Content>
      <Tabs.Content
        className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        <div className="mb-[15px] flex flex-row justify-between">
          <label
            className="text-violet12 my-1 w-1/3 text-[15px]"
            htmlFor="card-type"
          >
            Card Type
          </label>
          <select
            className="w-2/3 rounded-lg border border-gray-400 px-2 py-2"
            value={cardType}
            onChange={(event) =>
              setCardType(
                event.target.value as
                  | "VISA"
                  | "MASTERCARD"
                  | "DISCOVER"
                  | "AMEX"
              )
            }
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
            onChange={(event) => setCardNumber(event.target.value)}
          />
        </fieldset>
        <fieldset className="flex w-full flex-row justify-between space-x-3">
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="card-exp"
            >
              Expiration Month
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="expirationMonth" // Added value and change
              value={expirationMonth}
              defaultValue="12"
              onChange={(event) => setExpirationMonth(event.target.value)}
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
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="expirationYear" // Added value and change
              value={expirationYear}
              defaultValue="23"
              onChange={(event) => setExpirationYear(event.target.value)}
            />
          </fieldset>
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
            onChange={(event) => setBillingAddress(event.target.value)}
          />
        </fieldset>
        <fieldset className="flex w-full flex-row justify-between space-x-3">
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="Billing-city"
            >
              Billing City
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="billing-city"
              value={billingCity}
              defaultValue=""
              onChange={(event) => setBillingCity(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="billing-State"
            >
              Billing State
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="billing-state"
              value={billingState}
              defaultValue=""
              onChange={(event) => setBillingState(event.target.value)}
            />
          </fieldset>
          <fieldset className="mb-[15px] flex w-full flex-col justify-start">
            <label
              className="text-violet12 mb-2.5 block text-[13px] leading-none"
              htmlFor="home-address"
            >
              Billing Zip
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] w-full shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="home-zip"
              value={billingZipCode}
              defaultValue=""
              onChange={(event) => setBillingZip(event.target.value)}
            />
          </fieldset>
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
            onChange={(event) => setPassword(event.target.value)}
            type="password"
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
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
          />
        </fieldset>
        <form onSubmit={handleFormSubmit}>
          <button // ADDED this form
            className="w-full rounded-lg bg-indigo-500 py-2 px-4 font-medium text-white hover:bg-indigo-700"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default RegisterForm;
