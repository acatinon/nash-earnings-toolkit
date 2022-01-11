import { useContext, useMemo } from "react";
import { IoLogOutOutline } from 'react-icons/io5';
import Web3Context from "../contexts/web3-context";

export default ({ children }) => {

    const { account, deactivate } = useContext(Web3Context);
    const formattedAccount = useMemo(() => account && account.replace(/^(.{6}).*(.{4})$/g, '$1...$2'), [account]);
    const accountArea =  (
      <div className="flex items-center">
        <span className="rounded bg-blue-400 text-white font-semibold px-1 self-center">{formattedAccount}</span>
        <button className="p-2 text-xl" onClick={deactivate}><IoLogOutOutline /></button>
      </div>
    );

    return (
      <>
        <nav className="flex justify-between mb-4 p-4 border-b border-grey-200">
          <h1>Nash tools</h1>
          {account && accountArea}
        </nav>
        <main className="max-w-7xl flex flex-col h-full container grow">{children}</main>
      </>
    )
  }