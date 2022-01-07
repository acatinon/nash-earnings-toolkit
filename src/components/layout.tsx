import { useContext, useMemo } from "react";

import AccountContext from "../contexts/account-context";

export default ({ children }) => {

    const { account } = useContext(AccountContext);
    const formattedAccount = useMemo(() => account && account.replace(/^(.{6}).*(.{4})$/g, '$1...$2'), [account]);
    const accountArea = account ? (<div className="rounded bg-blue-400 text-white font-semibold px-1">{formattedAccount}</div>) : null;

    return (
      <>
        <nav className="flex justify-between  p-2 border-b border-grey-200">
          <h1>Nash tools</h1>
          {accountArea}
        </nav>
        <main className="container p-2 mx-auto">{children}</main>
      </>
    )
  }