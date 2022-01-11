import React, { useContext } from "react"
import { ProviderState } from "../utils/web3modal";
import { useContract, USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS } from "../utils/contract";
import Decimal from "../components/decimal";
import AmountEdit from "../components/amount-edit";
import Web3Context from "../contexts/web3-context";

export default (props) => {
  const { providerState, account, library, activate } = useContext(Web3Context);
  const { isActive, contract, balances, fee, connect } = useContract(providerState, account, library, activate);
  
  return  (
    <>
      <div>
        <h2>Earnings withdrawal tool</h2>
        <p>Hello !</p>
      </div>
      <Content isActive={isActive} contract={contract} providerState={providerState} balances={balances} fee={fee} connect={connect} />
    </>
  );
}

const Content = (props) => {
  switch (props.providerState) {
    case ProviderState.Init:
      return null;
    case ProviderState.NotConnected:
      return (
        <div className="flex grow">
          <button className="m-auto block" onClick={props.connect} >Connect your wallet</button>
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
        <div>
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
                  <button onClick={(e) => props.contract.withdraw(props.balances)}>Withdraw</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )    
  }
}
