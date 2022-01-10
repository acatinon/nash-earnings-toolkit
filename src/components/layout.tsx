import { useContext, useMemo } from "react";

import AccountContext from "../contexts/account-context";

export default ({ children }) => {

    const { account } = useContext(AccountContext);
    const formattedAccount = useMemo(() => account && account.replace(/^(.{6}).*(.{4})$/g, '$1...$2'), [account]);
    const accountArea = account ? (<span className="rounded bg-blue-400 text-white font-semibold px-1 self-center">{formattedAccount}</span>) : null;

    return (
      <>
        <nav className="flex justify-between mb-4 p-4 border-b border-grey-200">
          <h1>Nash tools</h1>
          {accountArea}
        </nav>
        <main className="max-w-7xl flex flex-col h-full container grow">{children}</main>
      </>
    )
  }