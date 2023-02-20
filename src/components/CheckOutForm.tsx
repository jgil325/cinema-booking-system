import React from "react";

const CheckOutForm = () => {
  return (
    <div className="flex grid">
      <div className="mx-2 grow rounded-b-md bg-white outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
        <p className="text-mauve11 mb-5 text-[15px] leading-normal">
          Set your account details here.
        </p>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="Email"
            defaultValue="John Smith"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="name"
          >
            Card Type
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="cardType"
            defaultValue="Visa"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="name"
          >
            Card Number
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="name"
            defaultValue=""
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="card"
          >
            Expiration (mm/yy)
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="expiration"
            defaultValue=""
          />
        </fieldset>
        <fieldset className="mb-[15px] flex w-full flex-col justify-start">
          <label
            className="text-violet12 mb-2.5 block text-[13px] leading-none"
            htmlFor="card"
          >
            Security Code
          </label>
          <input
            className="text-violet11 shadow-violet7 focus:shadow-violet8 h-[35px] shrink-0 grow rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="expiration"
            defaultValue=""
          />
        </fieldset>
      </div>
    </div>
  );
};

export default CheckOutForm;
