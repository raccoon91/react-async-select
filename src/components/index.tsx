import React, { FC, useState } from "react";
import styled from "styled-components";

import Maybe from "../helper/Maybe";

import { ReactComponent as Icon } from "../images/icon.svg";

const AsyncContainer = styled.div`
  position: relative;
`;

const AsyncWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AsyncInput = styled.input`
  border: none;
  outline: none;
`;

const Async: FC = () => {
  const [isOpenList, setIsOpenList] = useState<boolean>(false);

  const handleClick = (): void => {
    setIsOpenList(true);
  };

  return (
    <AsyncContainer>
      <AsyncWrapper>
        <AsyncInput onClick={handleClick} />
        <Icon width="12" height="12" />
      </AsyncWrapper>
      <Maybe isOpen={isOpenList}>
        <div>hi</div>
      </Maybe>
    </AsyncContainer>
  );
};

export default Async;
