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
};

const listItemDefaultSelectStyle: StyleObject = {
  color: "white",
  cursor: "pointer",
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

export interface ListItem {
  name: string;
  value: string;
}

export interface IAsyncProps {
  inputValue: string;
  displayedValue: string;
  handleChangeInput: (value: string) => void;
  handleSelectItem: (data: ListItem) => void;
  debouncedList: ListItem[];
  message?: string;
  style?: {
    containerStyle?: (props: StyleObject) => StyleObject;
    inputStyle?: (props: StyleObject) => StyleObject;
    listContainerStyle?: (props: StyleObject) => StyleObject;
    listItemStyle?: (props: StyleObject) => StyleObject;
    listItemSelectStyle?: (props: StyleObject) => StyleObject;
  };
}

const Async: FC<IAsyncProps> = ({
  inputValue,
  displayedValue,
  handleChangeInput,
  handleSelectItem,
  debouncedList,
  message,
  style,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpenList, setIsOpenList] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [listIndex, setListIndex] = useState<number>(0);

  const displayedList = inputValue ? debouncedList : [];

  const containerStyle =
    style && style.containerStyle ? style.containerStyle(containerDefaultStyle) : containerDefaultStyle;
  const inputStyle = style && style.inputStyle ? style.inputStyle(inputDefaultStyle) : inputDefaultStyle;
  const listContainerStyle =
    style && style.listContainerStyle ? style.listContainerStyle(listContainerDefaultStyle) : listContainerDefaultStyle;
  const listItemStyle = style && style.listItemStyle ? style.listItemStyle(listItemDefaultStyle) : listItemDefaultStyle;
  const listItemSelectStyle =
    style && style.listItemSelectStyle
      ? style.listItemSelectStyle(listItemDefaultSelectStyle)
      : listItemDefaultSelectStyle;

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

    if (isOpenList) {
      setTimeout(() => {
        handleBlur();
      }, 200);
    }
  };

  const onInputClick = (): void => {
    if (isFocused) {
      handleBlur();
    } else {
      handleFocus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const { key } = e;
    let index: number;

    if (key === "Escape") {
      handleBlur();
      return;
    }

    if (debouncedList.length) {
      if (key === "Enter") {
        handleSelectItem(debouncedList[listIndex]);
        setListIndex(0);
        handleBlur();
        return;
      }

      if (key === "ArrowDown") {
        index = listIndex < debouncedList.length - 1 ? listIndex + 1 : 0;

        setListIndex(index);
      }

      if (key === "ArrowUp") {
        index = listIndex >= 1 ? listIndex - 1 : debouncedList.length - 1;

        setListIndex(index);
      }
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
            onKeyDown={handleKeyDown}
            inputStyle={inputStyle}
          />
        </AsyncInputWrapper>
      </AsyncWrapper>
      <Maybe isOpen={isOpenList}>
        <List
          message={message}
          listIndex={listIndex}
          debouncedList={displayedList}
          handleSelectItem={handleSelectItem}
          handleBlur={handleBlur}
          setListIndex={setListIndex}
          listContainerStyle={listContainerStyle}
          listItemStyle={listItemStyle}
          listItemSelectStyle={listItemSelectStyle}
        />
      </Maybe>
    </AsyncContainer>
  );
};

export default Async;
