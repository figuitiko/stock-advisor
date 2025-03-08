import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = {
  children: React.ReactNode;
  heading: string;
  symbolSlot?: React.ReactNode;
};

export const AlertAction = ({ children, heading, symbolSlot }: Props) => {
  return (
    <Alert>
      {symbolSlot}
      <AlertTitle>{heading}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
