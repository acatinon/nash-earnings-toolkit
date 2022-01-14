import { useState } from "react";

import { useWeb3Modal, ProviderState } from "../utils/web3modal";
import Web3Context from "../contexts/web3-context";
import Layout from "../components/layout";

import '../styles/main.css';

export default ({ Component, pageProps }) => {
  const [error, setError] = useState<Error>(null);
  const { providerState, account, library, activate, deactivate } = useWeb3Modal(setError);

  return (
    <Web3Context.Provider value={{providerState, account, library, error, setError, activate, deactivate}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Context.Provider>
  );
}