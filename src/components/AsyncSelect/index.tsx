import React, { FC, useState, useRef } from "react";
import styled, { css, FlattenSimpleInterpolation, CSSObject } from "styled-components";

import Maybe from "./Maybe";
import List from "./List";

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

interface IControlerProps {
  isOpenList: boolean;
  isPending: boolean;
  active: boolean;
}
const Controler = styled.div<IControlerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 90%;
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

  const displayedList = inputValue ? debouncedList : [];

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
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsFocused(false);
    setIsOpenList(false);
    handleChangeInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;

    handleChangeInput(value);
  };

  const onInputBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log("onBlur");

    if (isOpenList) {
      setTimeout(() => {
        handleBlur();
      }, 200);
    }
  };

  const onInputClick = (): void => {
    console.log(isFocused);
    if (isFocused) {
      handleBlur();
    } else {
      handleFocus();
    }
  };

  return (
    <AsyncContainer>
      <AsyncWrapper containerStyle={containerStyle} onClick={onInputClick}>
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
            onBlur={onInputBlur}
            onChange={handleChange}
            inputStyle={inputStyle}
          />
        </AsyncInputWrapper>
      </AsyncWrapper>
      <Maybe isOpen={isOpenList}>
        <List
          message={message}
          onClickItem={onClickItem}
          handleBlur={handleBlur}
          debouncedList={displayedList}
          listContainerStyle={listContainerStyle}
          listItemStyle={listItemStyle}
        />
      </Maybe>
    </AsyncContainer>
  );
};

export default Async;
