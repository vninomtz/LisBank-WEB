import { LoginResponse, User } from "../types/Auth";
import { createContext, useReducer, useEffect } from "react";
import {
  setToken,
  setRefreshToken,
  deleteToken,
  deleteRefreshToken,
  setState,
  getState,
  deleteState,
} from "../utils/jwt";

export interface AuthState {
  isLoggedIn: Boolean;
  user?: User;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

export interface AuthContextProps {
  authState: AuthState;
  login: (login: LoginResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = (user: LoginResponse) => {
    dispatch({ type: "login", payload: user.data });
    setState(user.data);
    setToken(user.accessToken);
    setRefreshToken(user.refreshToken);
  };

  const logout = () => {
    dispatch({ type: "logout" });
    deleteToken();
    deleteRefreshToken();
    deleteState();
  };

  const loadUser = () => {
    if (!getState()) {
      return;
    }
    dispatch({ type: "login", payload: getState() });
  };
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

type AuthAction = { type: "login"; payload: User } | { type: "logout" };

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case "logout":
      return {
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
