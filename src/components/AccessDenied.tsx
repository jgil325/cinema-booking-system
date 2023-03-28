import React, { ReactNode } from "react";

interface Props {
  message?: string;
}
const AccessDenied = ({ message }: Props) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="bold  text-4xl font-medium">403 | Access Denied</h1>
      <div className="font-sm text-center">{message}</div>
    </div>
  );
};

export default AccessDenied;
