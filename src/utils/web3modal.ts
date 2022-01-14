import { useState, useEffect, Dispatch } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

export interface Web3ModalHook {
	providerState: ProviderState;
	account: string;
	library: ethers.providers.Web3Provider;
	activate: () => void;
	deactivate: () => void;
};

export enum ProviderState {
  Init,
  NotConnected,
  Connecting,
  Connected
}

export function useWeb3Modal(setError: Dispatch<Error>): Web3ModalHook {
  const [web3Modal, setWeb3Modal] = useState(null);
	const [providerState, setProviderState] = useState(ProviderState.Init);
	const [account, setAccount] = useState(null);
	const [library, setLibrary] = useState<ethers.providers.Web3Provider>(null);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          1: process.env.ETH_MAINNET_RPC
        }
      }
    }
	};

  useEffect(() => {
    const init = async () => {
      const w3M = new Web3Modal({
        network: "mainnet",
        cacheProvider: true, // optional
        providerOptions
      });
  
      if (w3M.cachedProvider) {
        await w3M.connect()
          .then(onConnect)
          .catch(onError);
      }
      else {
        setProviderState(ProviderState.NotConnected);
      }
    
      setWeb3Modal(w3M);
    }

    init();
  }, []);

  const onError = (error: Error) => {
    setError(error);
    setProviderState(ProviderState.NotConnected);
  };

  const onConnect = async (provider: any) => {
    setProviderState(ProviderState.Connecting);
    const library = new ethers.providers.Web3Provider(provider);
    let accounts = await library.listAccounts();
    setLibrary(library);
    setAccount(accounts[0]);
    setProviderState(ProviderState.Connected);
  };

  const activate = async (): Promise<void> => {
    web3Modal.connect()
      .then(onConnect)
      .catch(onError);
  }
  
  const deactivate = () => {
    web3Modal.clearCachedProvider();
    setAccount(null);
    setLibrary(null);
    setProviderState(ProviderState.NotConnected);
  }

  return {
	  providerState,
	  account,
	  library,
	  activate,
	  deactivate
  }
}
