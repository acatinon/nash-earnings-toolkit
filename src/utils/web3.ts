import { writable, Readable } from "svelte/store";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export interface Web3Store extends Readable<Web3Provider> {
	connect(): Promise<ethers.providers.Web3Provider>;
	connectIfCachedProvider(): Promise<ethers.providers.Web3Provider>;
	disconnect(): void;
}

export interface Web3Provider {
	provider?: ethers.providers.Web3Provider;
	chainId?: number;
	isConnected: boolean;
}

export function web3(): Web3Store {
	const providerOptions = {
		/* See Provider Options Section */
	};

	const web3Modal = new Web3Modal({
		network: "mainnet",
		cacheProvider: true, // optional
		providerOptions
	});

	const init: Web3Provider = {
		chainId: undefined,
		isConnected: false
	};

	const { subscribe, set, update } = writable(init);

	web3Modal.on("connect", (info: { chainId: number }) => {
		update(web3 => {
			web3.isConnected = true;
			web3.chainId = info.chainId;
			return web3;
		});
	});

	web3Modal.on("disconnect", (error: { code: number; message: string }) => {
		update(web3 => {
			web3.isConnected = false;
			web3.chainId = undefined;
			return web3;
		});
	});

	const createEthersProvider = (provider: any): ethers.providers.Web3Provider => {
		return new ethers.providers.Web3Provider(provider);
	}

	return {
		subscribe,
		connect: (): Promise<ethers.providers.Web3Provider> => {
			return web3Modal.connect().then(createEthersProvider);
		},
		connectIfCachedProvider: (): Promise<ethers.providers.Web3Provider> => {
			if (web3Modal.cachedProvider) {
				return web3Modal.connect().then(createEthersProvider);
			}

			return Promise.reject();
		},
		disconnect: () => {
			update(web3 => {
				web3.chainId = undefined;
				web3.isConnected = false;
				return web3;
			});
			web3Modal.clearCachedProvider();
		}
	}
}