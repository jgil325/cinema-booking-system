import { Promotion } from "@prisma/client";
import React, { useState } from "react";
import { api } from "../../utils/api";
import PromotionForm from "../forms/PromotionForm";
import Alert, { ErrorAlert } from "../ui/Alert";

export const ManagePromotions = () => {
  const { data: promotions } = api.promos.getAllPromos.useQuery();
  const sendEmail = api.promos.sendPromoEmail.useMutation();
  const [page, setPage] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | undefined>();
  const [showAlert, setShowAlert] = useState(false);
  const { mutateAsync, error } = api.promos.createPromo.useMutation();
  
  async function createPromo(promo) {
    console.log("dc", promo);
    const newPromo = {
      ...promo,
      startDate: new Date(promo.startDate),
      endDate: new Date(promo.endDate),
      discountPercent: parseFloat(promo.discount) / 100,
      discountCode: promo.code,
    };
    const result = await mutateAsync(newPromo)
    promotions?.push(newPromo);
    sendEmail.mutate({ id: result.id })
  }

  return (
    <div className="mb-8 flex grow grid-cols-2">
      <div className="h-full w-full space-y-2">
        <span className="text-xl font-medium">All Promotions</span>

        <div className="mx-4 h-full overflow-y-scroll rounded-lg border">
          <table className="min-w-full table-auto divide-y divide-x divide-gray-200 text-left ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promotions?.map((promo) => {
                return (
                  <tr
                    className={`hover:bg-gray-100 ${
                      selectedPromo?.id === promo.id ? "bg-gray-100" : ""
                    }`}
                    key={promo.id}
                    onClick={() => {
                      setSelectedPromo(promo);
                    }}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.code}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.discount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.startDate.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                      {promo.endDate.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-full w-full space-y-2">
        <span className="text-xl font-medium">Add New Promotion</span>

        <div className="mx-4 h-full rounded-lg border">
          <PromotionForm submitText="Create Promotion" onSubmit={createPromo} />
        </div>
        {showAlert ? <Alert message={"Promo Created"} /> : null}
        {error ? <ErrorAlert message="Failed to create promotion" /> : null}
      </div>
    </div>
  );
};
