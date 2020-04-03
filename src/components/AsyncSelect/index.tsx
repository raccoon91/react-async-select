import React, { FC, useState, useRef } from "react";
import styled, { css, FlattenSimpleInterpolation, CSSObject } from "styled-components";

import Maybe from "../../helper/Maybe";
import List from "./List";

import { ReactComponent as Icon } from "../../images/angle-down.svg";

export type StyleObject = CSSObject;

const containerDefaultStyle: StyleObject = {
  width: "10rem",
  height: "2rem",
  padding: "0 0.5rem",
  border: "1px solid black",
};

const inputDefaultStyle: StyleObject = {
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  "box-sizing": "border-box",
};

const listContainerDefaultStyle: StyleObject = {
  "overflow-y": "auto",
  position: "absolute",
  top: "2rem",
  width: "100%",
  "max-height": "25rem",
  border: "1px solid black",
  "background-color": "white",
  "box-sizing": "border-box",
  "z-index": "2",
};

const listItemDefaultStyle: StyleObject = {
  padding: "0.3rem 0.2rem",
  "&:hover": {
    "background-color": "blue",
    color: "white",
    cursor: "pointer",
  },
};

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
  containerStyle: StyleObject;
}
const AsyncWrapper = styled.div<IAsyncWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  ${({ containerStyle }): FlattenSimpleInterpolation =>
    css`
      ${containerStyle}
    `};
`;

const AsyncInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
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

interface IAsyncInputProps {
  inputStyle: StyleObject;
}
const AsyncInput = styled.input<IAsyncInputProps>`
  ${({ inputStyle }): FlattenSimpleInterpolation =>
    css`
      ${inputStyle}
    `}
`;

const Controler = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 90%;
`;

interface IAngleIconProps {
  open: boolean;
  isPending: boolean;
  active: boolean;
}
const AngleIcon = styled(Icon)<IAngleIconProps>`
  width: 1rem;
  height: 1rem;
  fill: ${({ active }): string => (active ? "black" : " gray")};
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
  ${({ isPending }): FlattenSimpleInterpolation | false =>
    isPending &&
    css`
      animation: load 0.5s ease-in-out infinite;
    `}

  @keyframes load {
    0% {
      fill: grey;
    }
    25% {
      fill: black;
    }
    75% {
      fill: black;
    }
    100% {
      fill: grey;
    }
  }
`;

export interface ListItem {
  name: string;
  value: string;
}

export interface IAsyncProps {
  inputValue: string;
  displayedValue?: string;
  handleChangeInput: (value: string) => void;
  onClickItem: (data: ListItem) => void;
  debouncedList: ListItem[];
  isPending: boolean;
  message?: string;
  style?: {
    containerStyle?: (props: StyleObject) => StyleObject;
    inputStyle?: (props: StyleObject) => StyleObject;
    listContainerStyle?: (props: StyleObject) => StyleObject;
    listItemStyle?: (props: StyleObject) => StyleObject;
  };
}

const Async: FC<IAsyncProps> = ({
  inputValue,
  displayedValue,
  handleChangeInput,
  onClickItem,
  debouncedList,
  isPending,
  message,
  style,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpenList, setIsOpenList] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const containerStyle =
    style && style.containerStyle ? style.containerStyle(containerDefaultStyle) : containerDefaultStyle;
  const inputStyle = style && style.inputStyle ? style.inputStyle(inputDefaultStyle) : inputDefaultStyle;
  const listContainerStyle =
    style && style.listContainerStyle ? style.listContainerStyle(listContainerDefaultStyle) : listContainerDefaultStyle;
  const listItemStyle = style && style.listItemStyle ? style.listItemStyle(listItemDefaultStyle) : listItemDefaultStyle;

  const handleFocus = (): void => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    setIsFocused(true);
    setIsOpenList(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    setIsOpenList(false);
    handleChangeInput("");
  };

  const handleClick = (): void => {
    if (isFocused) {
      handleBlur();
    } else {
      handleFocus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;

    handleChangeInput(value);
  };

  return (
    <>
      <Maybe isOpen={isOpenList}>
        <Overlay onClick={handleBlur} />
      </Maybe>
      <AsyncContainer>
        <AsyncWrapper containerStyle={containerStyle}>
          <AsyncInputWrapper>
            {displayedValue && !isFocused ? (
              <DisplayWrapper onClick={handleFocus}>
                <Displayedvalue>{displayedValue}</Displayedvalue>
              </DisplayWrapper>
            ) : null}
            <AsyncInput
              ref={inputRef}
              value={inputValue}
              placeholder="검색어를 입력해주세요."
              onChange={handleChange}
              onFocus={handleFocus}
              inputStyle={inputStyle}
            />
          </AsyncInputWrapper>
          <Controler>
            <AngleIcon
              open={isOpenList}
              onClick={handleClick}
              isPending={isPending}
              active={debouncedList.length !== 0}
            />
          </Controler>
        </AsyncWrapper>
        <Maybe isOpen={isOpenList}>
          <List
            message={message}
            onClickItem={onClickItem}
            handleBlur={handleBlur}
            debouncedList={debouncedList}
            listContainerStyle={listContainerStyle}
            listItemStyle={listItemStyle}
          />
        </Maybe>
      </AsyncContainer>
    </>
  );
};

export default Async;
