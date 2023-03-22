import React, { type InputHTMLAttributes, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { stateList } from "../data/states";
import { cardTypes } from "../data/cardTypes";
import { api } from "../utils/api";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
}

const InputField = ({ title, ...props }: InputFieldProps) => {
  return (
    <div className="grid">
      <span className="text-left font-medium">{title}</span>
      <input
        className="rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        id={title}
        {...props}
      />
    </div>
  );
};

const MyProfile = () => {
  const { data: session } = useSession();
  console.log(session?.user)
  const { data: user, isLoading } = api.user.byId.useQuery({
    email: session?.user.email || "",
  });
  console.log(user)
  //api.editProfile.sendConfirmEmail.useQuery();

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.firstName);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState(user?.homeCity);
  const [zipcode, setZipcode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  return (
    <div className="border-grey mt-4 grid items-center justify-center">
      <div className="grid min-w-[50vw] space-y-0 rounded-xl border px-8 py-8 text-center">
        <span className="text-center text-3xl font-medium">Your Profile</span>
        <span className="border-b border-gray-300 pt-4 text-left text-xl font-medium">
          Personal Information
        </span>
        <div className="grid grid-cols-2 space-x-6 pt-3">
          <div className="grid">
            <span className="text-left font-medium">Email</span>
            <input
              className="select-none rounded border border-gray-400 bg-gray-300 px-3 py-1.5 outline-none hover:cursor-not-allowed"
              type="text"
              id="email"
              placeholder="Email Address"
              value={user?.email}
              readOnly={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 space-x-6">
          <InputField title={"First Name"} value={firstName} />
          <InputField title={"Last Name"} value={lastName} />
        </div>
        <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
          Change Password
        </span>
        <div className="grid grid-cols-2 space-x-6  pt-3">
          <InputField
            title={"New Password"}
            value={newPass}
            type="password"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setNewPass(e.currentTarget.value);
            }}
          />
          <InputField
            title={"Old Password"}
            value={oldPass}
            type="password"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setOldPass(e.currentTarget.value);
            }}
          />
        </div>
        <div className="grid grid-cols-2 space-x-6">
          <InputField
            title={"Confirm New Password"}
            type="password"
            value={newPassConfirm}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setNewPassConfirm(e.currentTarget.value);
            }}
          />
          <div className="grid">
            <span className="invisible text-left font-medium">
              Change Password
            </span>
            <button
              className="h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
              type="submit"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
            >
              Change Password
            </button>
          </div>
        </div>

        <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
          Billing Address
        </span>
        <div className="grid grid-cols-1 space-x-6 pt-3">
          <InputField
            title={"Billing Address"}
            value={billingAddress}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setBillingAddress(e.currentTarget.value);
            }}
          />
        </div>
        <div className="grid grid-cols-3 items-baseline space-x-6 pt-3">
          <div className="grid">
            <span className="text-left font-medium">State</span>
            <select
              value={state}
              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                setState(e.currentTarget.value);
              }}
              className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {stateList.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>
          <InputField
            title={"Town / City"}
            value={city}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setCity(e.currentTarget.value);
            }}
          />
          <InputField
            title={"Zipcode"}
            value={zipcode}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setZipcode(e.currentTarget.value);
            }}
            type="number"
          />
        </div>
        <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
          Payment Card
        </span>
        <div className="grid grid-cols-4 space-x-6 pt-3">
          <div className="col-span-2">
            <InputField
              title={"Card Number"}
              type="text"
              value={cardNumber}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                setCardNumber(e.currentTarget.value);
              }}
            />
          </div>
          <div className="grid">
            <span className="text-left font-medium">Card Type</span>
            <select
              className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={cardType}
              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                setCardType(e.currentTarget.value);
              }}
            >
              {cardTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <InputField
            title={"Expiration Date"}
            type="number"
            value={expirationDate}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setExpirationDate(e.currentTarget.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
