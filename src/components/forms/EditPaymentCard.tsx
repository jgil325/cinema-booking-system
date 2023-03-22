import React, { type InputHTMLAttributes } from "react";
import { type PaymentCard } from "@prisma/client";
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
  const cardId = card.id;
  const { mutate: saveBillingStreet } =
    api.editProfile.changeBillingAddress.useMutation();

  const debouncedSaveBillingStreet = React.useMemo(
    () =>
      debounce((newStreetName: string) => {
        saveBillingStreet({ newStreetName, cardId });
      }, DEBOUNCE_DELAY),
    [cardId, saveBillingStreet]
  );
  const handleChangeBillingStreet = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setBillingAddress(e.currentTarget.value);
      debouncedSaveBillingStreet(e.currentTarget.value);
    },
    [debouncedSaveBillingStreet]
  );

  const { mutate: saveBillingState } =
    api.editProfile.changeBillingState.useMutation();
  const debouncedSaveBillingState = React.useMemo(
    () =>
      debounce((newStateName: string) => {
        saveBillingState({ newStateName, cardId });
      }, DEBOUNCE_DELAY),
    [cardId, saveBillingState]
  );
  const handleChangeBillingState = React.useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      setState(e.currentTarget.value);
      debouncedSaveBillingState(e.currentTarget.value);
    },
    [debouncedSaveBillingState]
  );

  const { mutate: saveBillingCity } =
    api.editProfile.changeBillingCity.useMutation();
  const debouncedSaveBillingCity = React.useMemo(
    () =>
      debounce((newCityName: string) => {
        saveBillingCity({ newCityName, cardId });
      }, DEBOUNCE_DELAY),
    [saveBillingCity, cardId]
  );
  const handleChangeBillingCity = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setCity(e.currentTarget.value);
      debouncedSaveBillingCity(e.currentTarget.value);
    },
    [debouncedSaveBillingCity]
  );

  const { mutate: saveBillingZip } =
    api.editProfile.changeBillingZipCode.useMutation();
  const debouncedSaveBillingZip = React.useMemo(
    () =>
      debounce((newZipCode: string) => {
        saveBillingZip({ newZipCode, cardId });
      }, DEBOUNCE_DELAY),
    [saveBillingZip, cardId]
  );
  const handleChangeBillingZip = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setZipcode(e.currentTarget.value);
      debouncedSaveBillingZip(e.currentTarget.value);
    },
    [debouncedSaveBillingZip]
  );

  const { mutate: saveCardNumber } =
    api.editProfile.changeCardNumber.useMutation();
  const debouncedSaveCardNumber = React.useMemo(
    () =>
      debounce((newCardNumber: string) => {
        saveCardNumber({ newCardNumber, cardId });
      }, DEBOUNCE_DELAY),
    [cardId, saveCardNumber]
  );
  const handleChangeCardNumber = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setCardNumber(e.currentTarget.value);
      debouncedSaveCardNumber(e.currentTarget.value);
    },
    [debouncedSaveCardNumber]
  );

  const { mutate: saveCardType } = api.editProfile.changeCardType.useMutation();
  const debouncedSaveCardType = React.useMemo(
    () =>
      debounce((newCardType: CardTypeEnum) => {
        saveCardType({ newCardType, cardId });
      }, DEBOUNCE_DELAY),
    [cardId, saveCardType]
  );
  const handleChangeCardType = React.useCallback(
    (e: React.FormEvent<HTMLSelectElement>) => {
      console.log();
      setCardType(e.currentTarget.value as CardTypeEnum);
      debouncedSaveCardType(e.currentTarget.value);
    },
    [debouncedSaveCardType]
  );

  const { mutate: saveCardExpiration } =
    api.editProfile.changeCardExpiration.useMutation();
  const debouncedSaveCardExpiration = React.useMemo(
    () =>
      debounce(
        (newCardExpirationMonth: number, newCardExpirationYear: number) => {
          saveCardExpiration({
            newCardExpirationMonth,
            newCardExpirationYear,
            cardId,
          });
        },
        DEBOUNCE_DELAY
      ),
    [cardId, saveCardExpiration]
  );
  const handleChangeCardExpirationMonth = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setExpirationMonth(parseInt(e.currentTarget.value));
      debouncedSaveCardExpiration(
        parseInt(e.currentTarget.value),
        expirationYear
      );
    },
    [debouncedSaveCardExpiration, expirationYear]
  );
  const handleChangeCardExpirationYear = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setExpirationYear(parseInt(e.currentTarget.value));
      debouncedSaveCardExpiration(
        expirationMonth,
        parseInt(e.currentTarget.value)
      );
    },
    [debouncedSaveCardExpiration, expirationMonth]
  );

  return (
    <>

      <span className="border-b border-gray-300 pt-4 text-left text-xl font-medium">
        Card Information
      </span>
      <div className="flex space-x-6 pt-3  ">
        <div className="grow">
          <InputField
            title={"Card Number"}
            type="number"
            value={cardNumber}
            onChange={handleChangeCardNumber}
          />
        </div>
        <div className="grid">
          <span className="text-left font-medium">Card Type</span>
          <select
            className="h-fit rounded border border-gray-400 bg-gray-50 px-3 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={cardType}
            onChange={handleChangeCardType}
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
          onChange={handleChangeCardExpirationMonth}
          min="0"
          max="12"
        />
        <InputField
          title={"Expiration Date"}
          type="number"
          value={expirationYear}
          onChange={handleChangeCardExpirationYear}
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
            onChange={handleChangeBillingState}
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
          onChange={handleChangeBillingCity}
        />
        <InputField
          title={"Zipcode"}
          value={zipcode}
          onChange={handleChangeBillingZip}
          type="number"
        />
      </div>
    </>
  );
};

export default EditPaymentCard;
