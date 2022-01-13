import { useState } from "react";

import { useWeb3Modal, ProviderState } from "../utils/web3modal";
import Web3Context from "../contexts/web3-context";
import Layout from "../components/layout";

import '../styles/main.css';

export default ({ Component, pageProps }) => {
  const { providerState, account, library, error, activate, deactivate } = useWeb3Modal();

  return (
    <Web3Context.Provider value={{providerState, account, library, error, activate, deactivate}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Context.Provider>
  );
}