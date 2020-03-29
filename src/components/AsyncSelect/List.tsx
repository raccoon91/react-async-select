import React, { FC } from "react";
import styled from "styled-components";

import { ListItem } from "./index";

interface IListContainerProps {
  height?: string;
}
const ListContainer = styled.div<IListContainerProps>`
  overflow-y: auto;
  position: absolute;
  top: ${({ height }): string => height || "2rem"};
  width: 100%;
  max-height: 25rem;
  margin-top: 0.5rem;
  border: 1px solid black;
  background-color: white;
  box-sizing: border-box;
  z-index: 2;
`;

const Item = styled.div`
  padding: 0.3rem 0.2rem;

  &:hover {
    background-color: blue;
    color: white;
    cursor: pointer;
  }
`;
const EmptyData = styled.div`
  padding: 1rem 0;
  color: gray;
  text-align: center;
`;

interface IListProps {
  height?: string;
  message?: string;
  onClickItem: (data: ListItem) => void;
  handleBlur: () => void;
  debouncedList: ListItem[];
}
const List: FC<IListProps> = ({ height, message, onClickItem, handleBlur, debouncedList }) => {
  const handleSelectItem = (data: ListItem) => {
    return (): void => {
      if (onClickItem) onClickItem(data);
      handleBlur();
    };
  };

  return (
    <ListContainer height={height}>
      {debouncedList.length ? (
        debouncedList.map((listItem, index) => (
          <Item key={index} onClick={handleSelectItem(listItem)}>
            {listItem.name}
          </Item>
        ))
      ) : (
        <EmptyData>{message || "empty"}</EmptyData>
      )}
    </ListContainer>
  );
};

export default List;
