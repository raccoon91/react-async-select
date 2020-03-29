import React, { FC, useState } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

import Maybe from "../../helper/Maybe";
import List from "./List";

import { ReactComponent as Icon } from "../../images/angle-down.svg";

const AsyncContainer = styled.div`
  position: relative;
  background-color: white;
  z-index: 2;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;

interface IAsyncWrapperProps {
  width?: string;
  height?: string;
}
const AsyncWrapper = styled.div<IAsyncWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${({ width }): string => width || "10rem"};
  height: ${({ height }): string => height || "2rem"};
  padding: 0 0.5rem;
  border: 1px solid black;
  box-sizing: border-box;
`;

const AsyncInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
`;

const DisplayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Displayedvalue = styled.div`
  width: 100%;
  background-color: white;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const AsyncInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
`;

interface IAngleIconProps {
  open: boolean;
}
const AngleIcon = styled(Icon)<IAngleIconProps>`
  width: 1rem;
  height: 1rem;
  fill: grey;
  transition: transform 0.3s ease-out;
  cursor: pointer;

  ${({ open }): FlattenSimpleInterpolation =>
    open
      ? css`
          transform: rotate(180deg);
        `
      : css`
          transform: rotate(0deg);
        `}
`;

export interface ListItem {
  name: string;
  value: string;
}

interface IAsyncProps {
  width?: string;
  height?: string;
  inputValue: string;
  displayedValue?: string;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClickItem: (data: ListItem) => void;
  debouncedList: ListItem[];
  message?: string;
}

const Async: FC<IAsyncProps> = ({
  width,
  height,
  inputValue,
  displayedValue,
  handleChangeInput,
  onClickItem,
  debouncedList,
  message,
}) => {
  const [isOpenList, setIsOpenList] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleClick = (): void => {
    if (isOpenList) {
      setIsOpenList(false);
    } else {
      setIsOpenList(true);
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
    setIsOpenList(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    setIsOpenList(false);
  };

  return (
    <>
      <Maybe isOpen={isOpenList}>
        <Overlay onClick={handleBlur} />
      </Maybe>
      <AsyncContainer>
        <AsyncWrapper width={width} height={height}>
          <AsyncInputWrapper>
            {displayedValue && !isFocused ? (
              <DisplayWrapper onClick={handleFocus}>
                <Displayedvalue>{displayedValue}</Displayedvalue>
              </DisplayWrapper>
            ) : null}
            <AsyncInput value={inputValue} onChange={handleChangeInput} onFocus={handleFocus} />
          </AsyncInputWrapper>
          <AngleIcon open={isOpenList} onClick={handleClick} />
        </AsyncWrapper>
        <Maybe isOpen={isOpenList}>
          <List
            height={height}
            message={message}
            onClickItem={onClickItem}
            handleBlur={handleBlur}
            debouncedList={debouncedList}
          />
        </Maybe>
      </AsyncContainer>
    </>
  );
};

export default Async;
