import React, { FC } from "react";

interface IMaybeProps {
  isOpen: boolean;
  children: React.ReactElement;
}
const Maybe: FC<IMaybeProps> = ({ isOpen, children }) => {
  return isOpen ? children : null;
};

export default Maybe;
