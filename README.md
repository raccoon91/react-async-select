# React Async Input

The Async Select NPM package for React

### Features

- Search input
- Render search list
- display selected list item
- customize style

## Installation and Usage

```Javascript
// npm install react-async-select or yarn add react-async-select

import AsyncSelect from 'react-async-select'

const style = {
  containerStyle: (props: StyleObject): StyleObject => ({
    ...props,
    width: "20rem",
    height: "2.5rem",
  }),
  inputStyle: (props: StyleObject): StyleObject => ({
    ...props,
    color: "red",
  }),
  listContainerStyle: (props: StyleObject): StyleObject => ({
    ...props,
    top: "2.7rem",
    "border-radius": "5px",
  }),
  listItemStyle: (props: StyleObject): StyleObject => ({
    ...props,
    "&:hover": {
      "background-color": "red",
    },
  }),
};

<Async
  inputValue={inputValue}
  displayedValue={selectedItem}
  handleChangeInput={handleChangeInput}
  onClickItem={onClickItem}
  debouncedList={debouncedList}
  message="Empty"
  style={style}
/>
```

## Project

```
git clone https://github.com/raccoon91/react-async-select.git
```

Add your code in `src/components/AsyncSelect`

<br/>

```
yarn start
```

Runs the example in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```
yarn build
```

Builds the AsyncSelect component to the `build` folder.<br />
It bundles React NPM package using `rollup.config.js`.
