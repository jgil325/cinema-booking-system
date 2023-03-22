import React from "react";
import { PaymentCard } from "@prisma/client";
import { useState } from "react";
import { api } from "../../utils/api";
import { debounce } from "../../utils/debounce";
import { stateList } from "../../data/states";
import { CardType as CardTypeEnum } from "@prisma/client";

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

const cardTypes = Object.values(CardTypeEnum);
const DEBOUNCE_DELAY = 500;

const EditPaymentCard = ({ card }: { card: PaymentCard }) => {
  const [billingAddress, setBillingAddress] = useState(card.billingAddress);
  const [state, setState] = useState(card.billingState);
  const [city, setCity] = useState(card.billingCity);
  const [zipcode, setZipcode] = useState(card.billingZipCode);
  const [cardNumber, setCardNumber] = useState(card.cardNumber);
  const [cardType, setCardType] = useState(card.cardType);
  const [expirationMonth, setExpirationMonth] = useState(card.expirationMonth);
  const [expirationYear, setExpirationYear] = useState(card.expirationYear);

  const { mutate: saveBillingStreet } =
    api.editProfile.changeBillingAddress.useMutation();

  const debouncedSaveBillingStreet = React.useMemo(
    () =>
      debounce((newStreetName: string) => {
        saveBillingStreet({ newStreetName, cardId: card.id });
      }, DEBOUNCE_DELAY),
    [saveBillingStreet]
  );
  const handleChangeBillingStreet = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setBillingAddress(e.currentTarget.value);
      debouncedSaveBillingStreet(e.currentTarget.value);
    },
    [debouncedSaveBillingStreet]
  );

  const { mutate: saveHomeState } =
    api.editProfile.changeHomeState.useMutation();
  const debouncedSaveHomeState = React.useMemo(
    () =>
      debounce((newStateName: string) => {
        saveHomeState({ newStateName });
      }, DEBOUNCE_DELAY),
    [saveHomeState]
  );
  const handleChangeHomeState = React.useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      setState(e.currentTarget.value);
      debouncedSaveHomeState(e.currentTarget.value);
    },
    [debouncedSaveHomeState]
  );

  const { mutate: saveHomeCity } = api.editProfile.changeHomeCity.useMutation();
  const debouncedSaveHomeCity = React.useMemo(
    () =>
      debounce((newCityName: string) => {
        saveHomeCity({ newCityName });
      }, DEBOUNCE_DELAY),
    [saveHomeCity]
  );
  const handleChangeHomeCity = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setCity(e.currentTarget.value);
      debouncedSaveHomeCity(e.currentTarget.value);
    },
    [debouncedSaveHomeCity]
  );

  const { mutate: saveHomeZip } =
    api.editProfile.changeHomeZipCode.useMutation();
  const debouncedSaveHomeZip = React.useMemo(
    () =>
      debounce((newZipName: string) => {
        saveHomeZip({ newZipName });
      }, DEBOUNCE_DELAY),
    [saveHomeZip]
  );
  const handleChangeHomeZip = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setZipcode(e.currentTarget.value);
      debouncedSaveHomeZip(e.currentTarget.value);
    },
    [debouncedSaveHomeZip]
  );

  return (
    <div className="border-grey mt-4 grid items-center justify-center">
      <div className="grid min-w-[50vw] space-y-0 rounded-xl border px-8 py-8 text-center">
        <span className="text-center text-3xl font-medium">Your Profile</span>
        <span className="border-b border-gray-300 pt-4 text-left text-xl font-medium">
          Card Information
        </span>
        <div className="grid grid-cols-8 space-x-6 pt-3">
          <div className="col-span-5">
            <InputField title={"Card Number"} type="text" value={cardNumber} />
          </div>
          <div className="grid">
            <span className="text-left font-medium">Card Type</span>
            <select
              className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={cardType}
            >
              {cardTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <InputField
            title={"Expiration Date"}
            type="number"
            value={expirationMonth}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setExpirationMonth(e.currentTarget.value);
            }}
            min="0"
            max="12"
          />
          <InputField
            title={"Expiration Date"}
            type="number"
            value={expirationYear}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setExpirationYear(e.currentTarget.value);
            }}
            min="23"
            max="30"
          />
        </div>
        <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
          Billing Address
        </span>
        <div className="grid grid-cols-1 space-x-6 pt-3">
          <InputField
            title={"Billing Address"}
            value={billingAddress}
            onChange={handleChangeBillingStreet}
          />
        </div>
        <div className="grid grid-cols-3 items-baseline space-x-6 pt-3">
          <div className="grid">
            <span className="text-left font-medium">State</span>
            <select
              value={state}
              onChange={handleChangeHomeState}
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
            onChange={handleChangeHomeCity}
          />
          <InputField
            title={"Zipcode"}
            value={zipcode}
            onChange={handleChangeHomeZip}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default EditPaymentCard;
