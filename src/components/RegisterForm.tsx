import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { z, ZodError } from 'zod';

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
  const [cardType, setCardType] = useState<'Select Card' | "VISA" | "MASTERCARD" | "DISCOVER" | "AMEX">("Select Card");
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

  const requiredBillingSchema = z.object({
    cardType: z.enum(["Select Card", "VISA", "MASTERCARD", "DISCOVER", "AMEX"]),
    cardNumber: z.union([z.string().length(16,{message: 'Invalid card number'}), z.literal("")]),
    expirationMonth: z.string().min(1,{message: 'Invalid expiration month'}),
    expirationYear: z.string().length(4,{message: 'Invalid expiration year'}),
    billingAddress: z.string().min(1,{message: 'Invalid billing address'}),
    billingCity: z.string().min(1,{message: 'Invalid billing city'}),
    billingState: z.string().min(1,{message: 'Invalid billing state'}),
    billingZipCode: z.string().length(5,{message: 'Invalid billing zip code'})
  });

  const optionalBillingSchema = z.object({
    cardType: z.enum(["Select Card", "VISA", "MASTERCARD", "DISCOVER", "AMEX"]), // select card default val
    cardNumber: z.unknown(),
    expirationMonth: z.unknown(),
    expirationYear: z.unknown(),
    billingAddress: z.unknown(),
    billingCity: z.unknown(),
    billingState: z.unknown(),
    billingZipCode: z.unknown(),
  });

  const billingSchema = requiredBillingSchema.or(optionalBillingSchema);

  const userDetailsSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    firstName: z.string().min(1,{message: 'Invalid first name'}),
    lastName: z.string().min(1,{message: 'Invalid last name'}),
    phoneNumber: z.string().length(10,{message: 'Invalid phone number'}),
    homeAddress: z.string().min(1,{message: 'Invalid home address'}),
    homeCity: z.string().min(1,{message: 'Invalid home city'}),
    homeState: z.string().min(1,{message: 'Invalid home state'}),
    homeZipCode: z.string().length(5,{message: 'Invalid home zip code'}),
    isSignedUpPromos: z.boolean(),

    cardType: z.union([z.enum(["Select Card", "VISA", "MASTERCARD", "DISCOVER", "AMEX"],), z.literal("")]),
    cardNumber: z.union([z.string().length(16,{message: 'Invalid card number'}), z.literal("")]),
    expirationMonth: z.union([z.string().min(1,{message: 'Invalid expiration month'}), z.literal("")]),
    expirationYear: z.union([z.string().length(4,{message: 'Invalid expiration year'}), z.literal("")]),
    billingAddress: z.union([z.string().min(1,{message: 'Invalid billing address'}), z.literal("")]),
    billingCity: z.union([z.string().min(1,{message: 'Invalid billing city'}), z.literal("")]),
    billingState: z.union([z.string().min(1,{message: 'Invalid billing state'}), z.literal("")]),
    billingZipCode: z.union([z.string().length(5,{message: 'Invalid billing zip code'}), z.literal("")]),

    password: z.string().min(1,{message: 'Invalid password'}),
    confirmPassword: z.string().min(1,{message: 'Invalid confirm password'})
  })
  .refine((value) => { // actually fuck this method but whatever
    if ((value.cardType=='Select Card')&&(value.cardNumber=="")&&(value.expirationMonth=="")&&(value.expirationYear=="")&&
      (value.billingAddress=="")&&(value.billingCity=="")&&(value.billingState=="")&&(value.billingZipCode=="")) {
        return true
      } else if ((value.cardType!='Select Card')&&(value.cardNumber!="")&&(value.expirationMonth!="")&&(value.expirationYear!="")&&
      (value.billingAddress!="")&&(value.billingCity!="")&&(value.billingState!="")&&(value.billingZipCode!="")) {
        return true
      } else {
        return false
      }
  }, {message: 'All payment info fields must be filled in or none of them!'});

  const validateFormData = () => {
    try {
      userDetailsSchema.parse({
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        homeAddress: homeAddress,
        homeCity: homeCity,
        homeState: homeState,
        homeZipCode: homeZipCode,
        isSignedUpPromos: isSignedUpPromos,

        cardType: cardType,
        cardNumber: cardNumber,
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        billingAddress: billingAddress,
        billingCity: billingCity,
        billingState: billingState,
        billingZipCode: billingZipCode,

        password: password,
        confirmPassword: confirmPassword

      })
      return true
    } catch (err) {
      if (err instanceof ZodError) {
        let fielderrors = Object.values(err.flatten().fieldErrors)
        let formerrors = Object.values(err.flatten().formErrors)
        alert('Please address the following registry errors:\n------------------------------------------------\n'
              +formerrors.join('\r\n')+'\n\n'+fielderrors.join('\r\n'))
      }
      return false
    }
  }

  // Hooks
  const createAccount = api.user.createAccount.useMutation();
  // const handleFormSubmit = console.log("placeholder");
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    console.log('attempt to validate with zod')
    const validatorResult = validateFormData();
    let createAccountResult;
    if (validatorResult) {
      try {
        createAccountResult = await createAccount.mutateAsync({
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          
          homeAddress: homeAddress,
          homeCity: homeCity,
          homeState: homeState,
          homeZipCode: homeZipCode,
          isSignedUpPromos: isSignedUpPromos,
      
          cardType: cardType,
          cardNumber: cardNumber,
          expirationMonth: expirationMonth,
          expirationYear: expirationYear,
          billingAddress: billingAddress,
          billingCity: billingCity,
          billingState: billingState,
          billingZipCode: billingZipCode,
      
          password: password,
          confirmPassword: confirmPassword
        });
        // TODO: Navigate to success page or show success message
          router.push("/checkEmail").catch(error => console.error(error));
      } catch (error) {
        /*let errorMessage;
        if (error instanceof TRPCClientError) {
          const errorResult = error.message;
          errorMessage =
            "Please correct your information regarding: \n" + errorResult;
          toast.error(errorMessage);
          const popup = document.createElement("div");
          popup.innerText = errorMessage;
          popup.style.position = "fixed";
          popup.style.top = "50%";
          popup.style.left = "50%";
          popup.style.transform = "translate(-50%, -50%)";
          popup.style.backgroundColor = "#fff";
          popup.style.color = "#000";
          popup.style.padding = "20px";
          popup.style.borderRadius = "5px";
          popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
          popup.style.maxWidth = "80%";
          popup.style.maxHeight = "80%";
          popup.style.overflow = "auto";
          popup.style.zIndex = "9999";
          document.body.appendChild(popup);
          const hidePopup = () => {
            popup.remove();
          };
          setTimeout(hidePopup, 20000);
          popup.addEventListener("click", hidePopup);
        } else {
          alert(error); // should be coming from backend
        }
        */
       alert('System Failure while attempting to create account. Try again in a couple of seconds.')
       console.log(error)
       // ^^ catch all for back end issues?????
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
            required={true}
            type=""
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
              required={true}
              type=""
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
              required={true}
              type=""
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
            required={true}
            type=""
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
            required={true}
            type=""
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
              required={true}
              type=""
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
              required={true}
              type=""
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
              required={true}
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
                  | 'Select Card'
                  | "VISA"
                  | "MASTERCARD"
                  | "DISCOVER"
                  | "AMEX"
              )
            }
            
          >
            <option value="Select Card">Select Card</option>
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
            type="number"
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
              type="number"
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
              type="number"
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
            type=""
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
              type=""
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
              type=""
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
              type=""
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
            type=""
            required={true}
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
