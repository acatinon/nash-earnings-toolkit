import { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

export type Activate = (onError?: (error: Error) => void) => Promise<void>;

export interface Web3ModalHook {
	active: boolean;
	account: string;
	library: ethers.providers.Web3Provider;
	activate: Activate;
	deactivate: () => void;
};

export function useWeb3Modal(): Web3ModalHook {
  const [web3Modal, setWeb3Modal] = useState(null);
	const [isActive, setActive] = useState(false);
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
    const w3M = new Web3Modal({
      network: "mainnet",
      cacheProvider: true, // optional
      providerOptions
    });
  
    setWeb3Modal(w3M);
  }, []);

	const createEthersProvider = (provider: any): ethers.providers.Web3Provider => {
		return new ethers.providers.Web3Provider(provider);
	}

  const activate = async (onError?: (error: Error) => void): Promise<void> => {
    web3Modal.connect()
      .then(createEthersProvider)
      .then(async (library) => {
        let accounts = await library.listAccounts();
        setLibrary(library);
        setAccount(accounts[0]);
        setActive(true);
      })
      .catch(e => {
        if (onError) {
          onError(e);
        }
      });
  }
  
  const deactivate = () => {
    web3Modal.clearCachedProvider();
    setLibrary(null);
    setActive(false);
  }

  return {
	  active: isActive,
	  account,
	  library,
	  activate,
	  deactivate
  }
}
