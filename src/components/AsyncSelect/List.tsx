import React, { FC, useRef, useEffect } from "react";
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
  selected: boolean;
  listItemStyle: StyleObject;
  listItemSelectStyle: StyleObject;
}
const Item = styled.div<IItemProps>`
  ${({ selected, listItemStyle, listItemSelectStyle }) =>
    selected
      ? css`
          ${listItemStyle}
          ${listItemSelectStyle}
        `
      : css`
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
  listIndex: number;
  debouncedList: ListItem[];
  setListIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelectItem: (data: ListItem) => void;
  handleBlur: () => void;
  listContainerStyle: StyleObject;
  listItemStyle: StyleObject;
  listItemSelectStyle: StyleObject;
}
const List: FC<IListProps> = ({
  message,
  listIndex,
  debouncedList,
  setListIndex,
  handleSelectItem,
  handleBlur,
  listContainerStyle,
  listItemStyle,
  listItemSelectStyle,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleSelectListItem = (data: ListItem) => {
    return (): void => {
      if (handleSelectItem) handleSelectItem(data);
      handleBlur();
    };
  };

  useEffect(() => {
    const list = listRef.current as HTMLDivElement;
    const children = list.children;

    if (list && children.length > 1) {
      const child = children[listIndex] as HTMLDivElement;
      const scroll = child.offsetTop;
      list.scrollTop = scroll - 100;
    }
  }, [listIndex, listRef]);

  const handleMouseEnterListItme = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const index = Number(e.currentTarget.dataset.index);

    setListIndex(index);
  };

  return (
    <ListContainer ref={listRef} listContainerStyle={listContainerStyle}>
      {debouncedList.length ? (
        debouncedList.map((listItem, index) => (
          <Item
            onMouseEnter={handleMouseEnterListItme}
            key={index}
            data-index={index}
            onClick={handleSelectListItem(listItem)}
            selected={index === listIndex}
            listItemStyle={listItemStyle}
            listItemSelectStyle={listItemSelectStyle}
          >
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
