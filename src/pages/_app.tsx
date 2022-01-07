import { useState } from "react";

import AccountContext from "../contexts/account-context";
import Layout from "../components/layout";

import '../styles/main.css';

export default ({ Component, pageProps }) => {
  const [account, setAccount] = useState<string>(null);

  return (
    <AccountContext.Provider value={{account, setAccount}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AccountContext.Provider>
  );
}