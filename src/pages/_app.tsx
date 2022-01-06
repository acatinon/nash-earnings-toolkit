import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from "ethers";

import '../styles/main.css'

function getLibrary(provider, connector) {
  return new ethers.providers.Web3Provider(provider);
}

export default ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}