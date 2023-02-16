import React, { useState } from "react";
import { z } from "zod";

interface EditProfileFormProps {
  onSubmit: (username: string, phoneNumber: string, password: string) => void;
}

const states = [
                "Select State","AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI",
                "ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO",
                "MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI",
                "SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
                ];
const cardTypes = ["Select Card","Mastercard","Visa","Amex"];

function StatesDropdownForm() {
  const [selected, setSelected] = useState(states[0]);
  return (
    <form>
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="username"
        >
          State
        </label>
      <select 
       className="rounded-lg border border-gray-400 px-2 py-2"
       value={selected} 
       onChange={(e) => setSelected(e.target.value)}>
         {states.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
         ))}
      </select>
    </form>
  );
}

function CardTypeDropdownForm() {
    const [selected, setSelected] = useState(cardTypes[0]);
    return (
      <form>
          <label
            className="mb-2 block font-medium text-gray-700"
            htmlFor="username"
          >
            Card Type
          </label>
        <select 
         className="rounded-lg border border-gray-400 px-2 py-2"
         value={selected} 
         onChange={(e) => setSelected(e.target.value)}>
           {cardTypes.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
           ))}
        </select>
      </form>
    );
  }

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setPhoneNumberError("");

    // NEEDS LOTS OF PROPER ERROR HANDLING AND ONLY PATCH CHANGED FIELDS
    const schema = z.object({
      //username: z.string().required(),
      //password: z.string().min(8).required(),
    });

    const values = { username, phoneNumber, password };
    //const validated = schema.validate(values);

    /**if (validated.error) {
      validated.error.details.forEach((error) => {
        if (error.path[0] === "username") {
          setUsernameError(error.message);
        } else if (error.path[0] === "password") {
          setPasswordError(error.message);
        }
      });
      return;
    }**/

    onSubmit(username, phoneNumber, password);
  };

  return (
    <form className="rounded-lg bg-white p-20 shadow-md" onSubmit={handleSubmit}>
        <label
          className="mb-2 block text-center text-xl font-medium text-gray-700"
        >
          Edit Profile
        </label>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="username"
        >
          Name
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        {usernameError && (
          <div className="mt-2 text-xs text-red-500">{usernameError}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Phone Number
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        {phoneNumberError && (
          <div className="mt-2 text-xs text-red-500">{phoneNumberError}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && (
          <div className="mt-2 text-xs text-red-500">{passwordError}</div>
        )}
      </div>
      <label
          className="my-4 block text-center text-xl font-medium text-gray-700"
        >
          Edit Address
        </label>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Street
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          City
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <StatesDropdownForm/>
        <div className="mb-4">
            <label
            className="mb-2 block font-medium text-gray-700"
            htmlFor="password"
            >
            Zipcode
            </label>
            <input
            className="w-24 rounded-lg border border-gray-400 px-2 py-2"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
        </div>
      </div>
      <label
          className="my-4 block text-center text-xl font-medium text-gray-700"
        >
          Edit Billing Information
        </label>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Street
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          City
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="flex flex-row justify-between">
        <StatesDropdownForm/>
        <div className="mb-4">
            <label
            className="mb-2 block font-medium text-gray-700"
            htmlFor="password"
            >
            Zipcode
            </label>
            <input
            className="w-24 rounded-lg border border-gray-400 px-2 py-2"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <CardTypeDropdownForm/>
        <div className="mb-4">
            <label
            className="mb-2 block font-medium text-gray-700"
            htmlFor="password"
            >
            Exp. Date
            </label>
            <input
            className="w-24 rounded-lg border border-gray-400 px-2 py-2"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
        </div>
      </div>
      <div className="mb-4">
        <label
          className="mb-2 block font-medium text-gray-700"
          htmlFor="password"
        >
          Card Number
        </label>
        <input
          className="w-full rounded-lg border border-gray-400 px-12 py-2"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div className="flex justify-center mt-12">
        <button
            className="rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white hover:bg-indigo-700 shadow-lg"
            type="submit"
        >
            Submit Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
