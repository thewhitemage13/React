import { createContext } from "react";

const AppContext = createContext({
  user: null,
  setUser: () => {},
  count: 0,
  setCount: () => {}
});

export default AppContext;

