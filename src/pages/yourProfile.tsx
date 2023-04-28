import React, { type InputHTMLAttributes, useState, useEffect } from "react";
import { stateList } from "../data/states";
import { api } from "../utils/api";
import { debounce } from "../utils/debounce";
import EditPaymentCard from "../components/forms/EditPaymentCard";
import { PaymentCard } from "@prisma/client";
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  title?: string;
}
const DEBOUNCE_DELAY = 500;
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

const Page = () => {
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [showCards, setShowCards] = useState(false);

  const { mutate: createNewCard } =
    api.paymentCard.createPaymentInfo.useMutation({
      onSuccess: async () => {
        await refetchCards();
      },
    });

  const { data: cards, refetch: refetchCards } = api.paymentCard.byId.useQuery();

  useEffect(() => {
    async function doFetch() {
      await refetchCards();
    }
    if (!showCards) setSelectedCard(null);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    doFetch();
  }, [refetchCards, showCards, selectedCard]);

  async function doCreateCard() {
    createNewCard({
      cardNumber: "4274904744200811",
      cardType: "VISA",
      billingAddress: "1234 Street",
      expirationMonth: 1,
      expirationYear: 2025,
      billingCity: "City",
      billingState: "State",
      billingZipCode: "00000",
      userId: user?.id || "",
    });
    await refetchCards();
  }

  const { data: user, isLoading, error } = api.user.byId.useQuery();

  if (isLoading) return null;
  if (error)
    return (
      <div>
        <h1>Something Went Wrong</h1>
        <span>{JSON.stringify(error)}</span>
      </div>
    );
  if (!user)
    return (
      <div>
        <h1>Something Went Wrong</h1>
        <span>User Not Found</span>
      </div>
    );

  const tempCard: PaymentCard = {
    id: "1234",
    cardNumber: "123432432432412",
    cardType: "VISA",
    expirationMonth: 5,
    expirationYear: 23,
    billingAddress: "1234 road road rd.",
    billingCity: "Atlanta",
    billingState: "GA",
    billingZipCode: "30323",
    userId: "532432fda",
  };
  //const cards: Array<PaymentCard> = [tempCard, tempCard, tempCard];

  return (
    <div className="border-grey mt-4 grid items-center justify-center">
      <div className="grid min-w-[50vw] space-y-0 rounded-xl border px-8 py-8 text-center">
        {!showCards ? (
          <>
            <MyProfile user={user} />
            <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium"></span>
            <div className="grid grid-cols-1 items-baseline space-x-6 pt-3">
              <button
                className="h-fit w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 font-medium text-black hover:bg-gray-200"
                type="submit"
                onClick={() => setShowCards(true)}
              >
                Edit Payment Cards
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-center text-3xl font-medium">
              Your Payment Cards
            </span>
            <div className="flex justify-center">
              {cards.map((card, index) => {
                const selected = selectedCard === card;
                let className =
                  "my-3 mx-3 grow rounded border bg-gray-50 px-4 py-1.5 hover:bg-gray-200";
                if (selected) className += "border-black border-2";
                return (
                  <button
                    className={className}
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                  >
                    Card {index}
                  </button>
                );
              })}
              {cards.length < 3 ? (
                <button
                  onClick={doCreateCard}
                  className="my-3 mx-3 grow rounded border bg-gray-50 px-4 py-1.5 hover:bg-gray-200"
                >
                  Add A New Card
                </button>
              ) : null}
            </div>
            {selectedCard ? <EditPaymentCard card={selectedCard} /> : null}

            <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium"></span>
            <div className="grid grid-cols-1 items-baseline space-x-6 pt-3">
              <button
                className="h-fit w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 font-medium text-black hover:bg-gray-200"
                type="submit"
                onClick={() => setShowCards(false)}
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MyProfile = ({ user }: { user: User }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [isPromos, setIsPromos] = useState(user.isSignedUpPromos)
  const [billingAddress, setBillingAddress] = useState(user.homeAddress);
  const [state, setState] = useState(user.homeState);
  const [city, setCity] = useState(user.homeCity);
  const [zipcode, setZipcode] = useState(user.homeZipCode);
  const [editStatus, setEditStatus] = useState(true)
  const { mutate: saveFirstName } =
    api.editProfile.changeFirstName.useMutation();
  const debouncedSaveFirstName = React.useMemo(
    () =>
      debounce((newFirstName: string) => {
        saveFirstName({ newFirstName });
      }, DEBOUNCE_DELAY),
    [saveFirstName]
  );
  const handleChangeFirstName = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setFirstName(e.currentTarget.value);
      debouncedSaveFirstName(e.currentTarget.value);
    },
    [debouncedSaveFirstName]
  );

  const { mutate: saveLastName } = api.editProfile.changeLastName.useMutation();
  const debouncedSaveLastName = React.useMemo(
    () =>
      debounce((newLastName: string) => {
        saveLastName({ newLastName });
      }, DEBOUNCE_DELAY),
    [saveLastName]
  );
  const handleChangeLastName = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setLastName(e.currentTarget.value);
      debouncedSaveLastName(e.currentTarget.value);
    },
    [debouncedSaveLastName]
  );

  const { mutate: savePhoneNumber } = api.editProfile.changePhoneNumber.useMutation();
  const debouncedSavePhoneNumber = React.useMemo(
    () =>
      debounce((newPhoneNumber: string) => {
        savePhoneNumber({ newPhoneNumber });
      }, DEBOUNCE_DELAY),
    [savePhoneNumber]
  );
  const handleChangePhoneNumber = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setPhoneNumber(e.currentTarget.value);
      debouncedSavePhoneNumber(e.currentTarget.value);
    },
    [debouncedSavePhoneNumber]
  );

  const { mutateAsync: changePassword } =
    api.editProfile.changePassword.useMutation();
  const handleChangePassword = async() => {
    if (newPassword.localeCompare(newPassConfirm) !== 0)
      return window.alert("New Passwords Do Not Match");
    try {
      await changePassword({ newPassword, oldPassword });
      setNewPassConfirm('')
      setOldPassword('')
      setNewPassword('')
      alert('Successfully changed password!')
    } catch {
      alert('Issue updating your password.')
    }
  };

  const { mutate: changePromoStatus } = 
    api.editProfile.changePromoStatus.useMutation();
  const debouncedSavePromos = React.useMemo(
    () =>
      debounce((newPromoStatus: boolean) => {
        changePromoStatus({ newPromoStatus });
      }, DEBOUNCE_DELAY),
    [changePromoStatus]
  );
  const changePromoHandler = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setIsPromos(e.currentTarget.checked);
      debouncedSavePromos(e.currentTarget.checked);
    },
    [debouncedSavePromos]
  );

  const { mutate: saveHomeStreet } =
    api.editProfile.changeHomeStreet.useMutation();
  const debouncedSaveHomeStreet = React.useMemo(
    () =>
      debounce((newStreetName: string) => {
        saveHomeStreet({ newStreetName });
      }, DEBOUNCE_DELAY),
    [saveHomeStreet]
  );
  const handleChangeHomeStreet = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setBillingAddress(e.currentTarget.value);
      debouncedSaveHomeStreet(e.currentTarget.value);
    },
    [debouncedSaveHomeStreet]
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
    <>
      <span className="text-center text-3xl font-medium">Your Profile</span>
      <span className="border-b border-gray-300 pt-4 text-left text-xl font-medium">
        Personal Information
      </span>
      <div className="grid grid-cols-2 space-x-6 py-3">
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
        <div className="grid">
          <div className="flex pl-48">
              <span className="pt-8 text-right text-l font-medium">
                Editing Mode
              </span>
              <div className="pl-4 pt-9">
                <input
                  type="checkbox"
                  id="editstatus"
                  defaultChecked={!editStatus}
                  className="h-4 w-4 border-gray-900 bg-gray-50 hover:cursor-pointer hover:border-gray-500"
                  onChange={()=>{setEditStatus(!editStatus)}}
                />
              </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 space-x-6">
        <InputField
          title={"First Name"}
          value={firstName}
          onChange={handleChangeFirstName}
          readOnly={editStatus}
        />
        <InputField
          title={"Last Name"}
          value={lastName}
          onChange={handleChangeLastName}
          readOnly={editStatus}
        />
      </div>
      <div className="grid grid-cols-2 space-x-6">
        <InputField
          title={"Phone Number"}
          value={phoneNumber}
          onChange={handleChangePhoneNumber}
          readOnly={editStatus}
        />
      </div>
      <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
        Change Password
      </span>
      <div className="grid grid-cols-2 space-x-6  pt-3">
        <InputField
          title={"New Password"}
          value={newPassword}
          type="password"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setNewPassword(e.currentTarget.value);
          }}
          readOnly={editStatus}
        />
        <InputField
          title={"Old Password"}
          value={oldPassword}
          type="password"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setOldPassword(e.currentTarget.value);
          }}
          readOnly={editStatus}
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
          readOnly={editStatus}
        />
        <div className="grid">
          <span className="invisible text-left font-medium">
            Change Password
          </span>
          <button
            className="h-fit rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
            type="submit"
            onClick={handleChangePassword}
            disabled={editStatus}
          >
            Change Password
          </button>
        </div>
      </div>
      <div className="flex">
        <span className="pt-8 text-right text-l font-medium">
          Opt into Promotions
        </span>
        <div className="pl-4 pt-9">
          <input
            type="checkbox"
            id="promos"
            defaultChecked={isPromos}
            className="h-4 w-4 border-gray-900 bg-gray-50 hover:cursor-pointer hover:border-gray-500"
            onChange={changePromoHandler}
            disabled={editStatus}
          />
        </div>
      </div>
      <span className="border-b border-gray-300 pt-8 text-left text-xl font-medium">
        Home Address
      </span>
      <div className="grid grid-cols-1 space-x-6 pt-3">
        <InputField
          title={"Home Address"}
          value={billingAddress}
          onChange={handleChangeHomeStreet}
          readOnly={editStatus}
        />
      </div>
      <div className="grid grid-cols-3 items-baseline space-x-6 pt-3">
        <div className="grid">
          <span className="text-left font-medium">State</span>
          <select
            value={state}
            onChange={handleChangeHomeState}
            disabled={editStatus}
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
          readOnly={editStatus}
        />
        <InputField
          title={"Zipcode"}
          value={zipcode}
          onChange={handleChangeHomeZip}
          readOnly={editStatus}
          type="number"
        />
      </div>
    </>
  );
};

export default Page;
