import { useContext, useMemo } from "react";
import { IoLogOutOutline, IoAlertCircleOutline } from 'react-icons/io5';
import Web3Context from "../contexts/web3-context";

export default ({ children }) => {

  const { account, error, setError, deactivate } = useContext(Web3Context);
  const formattedAccount = useMemo(() => account && account.replace(/^(.{6}).*(.{4})$/g, '$1...$2'), [account]);
  const accountArea = (
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
      <ErrorModal error={error} setError={setError} />
    </>
  )
}

const ErrorModal = ({ error, setError }) => {

  const resetError = () => {
    setError(null);
  }

  if (error) {
    return (
      <div className="flex fixed inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto h-full w-full" onClick={resetError}>
        <div className="flex flex-col m-auto bg-white rounded-lg min-w-[25rem] shadow-md">
          <div className="flex">
            <IoAlertCircleOutline className="m-4 text-red-500 text-4xl" />
            <div className="p-4 pl-0 flex-grow">
              <h3 className="text-xl text-red-500">Error</h3>
              <div>{error.message || error.toString()}</div>
            </div>
          </div>
          <div className="flex justify-end bg-gray-100 rounded-b-lg p-2">
            <button className="secondary" onClick={resetError}>Ok</button>
          </div>
        </div>
      </div>
    )
  }

  return null;
}
