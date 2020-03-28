import React, { FC } from "react";
import styled from "styled-components";

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
  return (
    <AsyncContainer>
      <AsyncWrapper>
        <AsyncInput />
        <Icon width="12" height="12" />
      </AsyncWrapper>
    </AsyncContainer>
  );
};

export default Async;
