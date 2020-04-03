import React, { FC } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

import { ListItem, StyleObject } from "./index";

interface IListContainerProps {
  listContainerStyle: StyleObject;
}
const ListContainer = styled.div<IListContainerProps>`
  ${({ listContainerStyle }): FlattenSimpleInterpolation =>
    css`
      ${listContainerStyle}
    `}
`;

interface IItemProps {
  listItemStyle: StyleObject;
}
const Item = styled.div<IItemProps>`
  ${({ listItemStyle }): FlattenSimpleInterpolation =>
    css`
      ${listItemStyle}
    `}
`;

const EmptyData = styled.div`
  padding: 0.5rem 0;
  color: gray;
  text-align: center;
`;

interface IListProps {
  message?: string;
  onClickItem: (data: ListItem) => void;
  handleBlur: () => void;
  debouncedList: ListItem[];
  listContainerStyle: StyleObject;
  listItemStyle: StyleObject;
}
const List: FC<IListProps> = ({
  message,
  onClickItem,
  handleBlur,
  debouncedList,
  listContainerStyle,
  listItemStyle,
}) => {
  const handleSelectItem = (data: ListItem) => {
    return (): void => {
      if (onClickItem) onClickItem(data);
      handleBlur();
    };
  };

  return (
    <ListContainer listContainerStyle={listContainerStyle}>
      {debouncedList.length ? (
        debouncedList.map((listItem, index) => (
          <Item key={index} onClick={handleSelectItem(listItem)} listItemStyle={listItemStyle}>
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
