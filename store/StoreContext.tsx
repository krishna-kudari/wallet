import React, { ReactNode } from "react";
import { WalletStore } from "./WalletStore";
import { createContext, useContext } from "react";
import {BitcoinStore} from "./BitCoinStore";

class RootStore {
  walletStore: WalletStore;
  bitcoinStore: BitcoinStore;
  constructor() {
    this.walletStore = new WalletStore();
    this.bitcoinStore = new BitcoinStore();
  }
}

// Create a context with an undefined initial value
const StoreContext = createContext<RootStore | undefined>(undefined);

// StoreProvider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const rootStore = new RootStore();

  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

// Custom hook to use the store
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
};
