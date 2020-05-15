import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import Async, { ListItem, StyleObject } from "./components/AsyncSelect/index";

import debounce from "./utils/debounce";

interface IAxiosData {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const AppConatiner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const App: FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [interval, setInterval] = useState<number | null>(null);
  // const [isPending, setIsPending] = useState<boolean>(false);
  const [debouncedList, setDebouncedList] = useState<ListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const handleChangeInput = (value: string): void => {
    setInputValue(value);
    setInterval(
      debounce(
        () => {
          setDebouncedValue(value);
        },
        500,
        interval,
      ),
    );
  };

  const getFakeData = async (debouncedValue: string) => {
    try {
      // setIsPending(true);
      const keyword = debouncedValue.split("").reduce((acc, cur) => {
        return (acc += cur.charCodeAt(0));
      }, 0);

      const res = await axios({
        method: "get",
        url: `https://jsonplaceholder.typicode.com/todos?userId=${(keyword % 10) + 1}`,
      });

      const list = res.data;

      if (list) {
        const searchList = list.map((data: IAxiosData) => {
          return {
            name: data.title,
            value: data.title,
          };
        });

        setDebouncedList(searchList);
      } else {
        setDebouncedList([]);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      // setIsPending(false);
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      getFakeData(debouncedValue);
    }
  }, [debouncedValue]);

  const handleSelectItem = (data: ListItem): void => {
    setSelectedItem(data.value);
  };

  const style = {
    containerStyle: (props: StyleObject): StyleObject => ({
      ...props,
      width: "30rem",
      height: "3rem",
      borderRadius: "5px",
    }),
    inputStyle: (props: StyleObject): StyleObject => ({
      ...props,
      fontSize: "16px",
    }),
    listContainerStyle: (props: StyleObject): StyleObject => ({
      ...props,
      top: "3.2rem",
      "border-radius": "5px",
    }),
    listItemStyle: (props: StyleObject): StyleObject => ({
      ...props,
    }),
    listItemSelectStyle: (props: StyleObject): StyleObject => ({
      ...props,
      "background-color": "blue",
    }),
  };

  return (
    <AppConatiner>
      <Async
        inputValue={inputValue}
        displayedValue={selectedItem}
        handleChangeInput={handleChangeInput}
        handleSelectItem={handleSelectItem}
        debouncedList={debouncedList}
        message="데이터가 없습니다."
        style={style}
      />
    </AppConatiner>
  );
};

export default App;
