import React, { useContext } from "react"
import { ProviderState } from "../utils/web3modal";
import { IoAlertCircleOutline, IoWarningOutline, IoHelpCircleOutline } from 'react-icons/io5';
import { useContract, USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS } from "../utils/contract";
import Decimal from "../components/decimal";
import AmountEdit from "../components/amount-edit";
import Web3Context from "../contexts/web3-context";

export default (props) => {
  const { providerState, account, library, error, activate } = useContext(Web3Context);
  const { isActive, contract, balances, fee, connect } = useContract(providerState, account, library, activate);
  
  return  (
    <>
      <div>
        <h2>Earning withdrawal tool</h2>
        <WarningMessage>
          This tool is not official and is not endorsed by the Nash team. Use at your own risk!
        </WarningMessage>
        <p>As you may know, on the mobile app, the Nash earning product only allow to cash out to fiat.
        But earning is non-custodial, which means that it's possible to withdraw your stablecoin tokens
        at any time by interacting directly with the blockchain.</p>
        <p>This tool allows you to call a method on the earning smart contract that will withdraw your
          aTokens from Aave and transfer the correponding stablecoins to your wallet.</p>
      </div>
      <Content
        isActive={isActive}
        error={error}
        contract={contract}
        providerState={providerState}
        balances={balances}
        fee={fee}
        connect={connect} />
    </>
  );
}

const WarningMessage = (props) => {
  if (props.children) {
    return (
      <p className="bg-amber-50 border-l-2 border-amber-500 p-2">
        <h3 className="flex items-center text-amber-500"><IoWarningOutline className="text-xl" />&nbsp;Warning</h3>
        <div>{props.children}</div>
      </p>
    )
  }
  return null;
}

const ErrorMessage = (props) => {
  if (props.children) {
    return (
      <p className="bg-red-50 border-l-2 border-red-500 p-2">
        <h3 className="flex items-center text-red-500"><IoAlertCircleOutline className="text-xl" />&nbsp;Error</h3>
        <div>{props.children}</div>
      </p>
    )
  }
  return null;
}

const Content = (props) => {
  switch (props.providerState) {
    case ProviderState.Init:
      return null;
    case ProviderState.NotConnected:
      return (
        <div className="flex flex-col grow">
          <ErrorMessage>{props.error}</ErrorMessage>
          <button className="primary m-auto block" onClick={props.connect} >Connect your wallet</button>
        </div>
      )
    case ProviderState.Connecting:
      return (
        <p>Connecting...</p>
      )
    case ProviderState.Connected:
      if (!props.isActive) {
        return null;
      }
      return (
        <div className="grid grid-cols-2 gap-4">
          <table>
            <thead>
              <tr>
                <th>Assets</th>
                <th>Holdings</th>
                <th>Amounts to withdraw</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="asset"><img src="img/usdc.png" alt="USDC" /> USDC</td>
                <td className="text-right"><Decimal value={props.balances.usdc} /></td>
                <td><AmountEdit maxValue={props.balances.usdc} decimalPlaces={USDC_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/dai.png" alt="USDC" /> DAI</td>
                <td className="text-right"><Decimal value={props.balances.dai} /></td>
                <td><AmountEdit maxValue={props.balances.dai} decimalPlaces={DAI_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/usdt.png" alt="USDC" /> USDT</td>
                <td className="text-right"><Decimal value={props.balances.usdt} /></td>
                <td><AmountEdit maxValue={props.balances.usdt} decimalPlaces={USDT_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/gusd.png" alt="USDC" /> GUSD</td>
                <td className="text-right"><Decimal value={props.balances.gusd} /></td>
                <td><AmountEdit maxValue={props.balances.gusd} decimalPlaces={GUSD_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/busd.png" alt="USDC" /> BUSD</td>
                <td className="text-right"><Decimal value={props.balances.busd} /></td>
                <td><AmountEdit maxValue={props.balances.busd} decimalPlaces={BUSD_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="p-0 py-2 border-0 text-right" colSpan={3}>
                  <span className="text-gray-600">Manual withdrawal fee: <Decimal value={props.fee} decimalPlaces={2} />%</span>
                  &nbsp;
                  <button className="primary" onClick={(e) => props.contract.withdraw(props.balances)}>Withdraw</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )    
  }
}
