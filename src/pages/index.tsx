import React from "react"
import { useWeb3Modal } from "../utils/web3modal";
import { ContractState, useContract, USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS } from "../utils/contract";
import Decimal from "../components/decimal";
import AmountEdit from "../components/amount-edit";


export default (props) => {

  const { active, account, library, activate, deactivate } = useWeb3Modal();
  const { contractState, contract, balances, fee, error, connect } = useContract(active, account, library, activate);

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  switch (contractState) {
    case ContractState.Connected:
      return (
        <>
          <p>Connected with {account}</p>
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
                <td className="text-right"><Decimal value={balances.usdc} /></td>
                <td><AmountEdit maxValue={balances.usdc} decimalPlaces={USDC_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/dai.png" alt="USDC" /> DAI</td>
                <td className="text-right"><Decimal value={balances.dai} /></td>
                <td><AmountEdit maxValue={balances.dai} decimalPlaces={DAI_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/usdt.png" alt="USDC" /> USDT</td>
                <td className="text-right"><Decimal value={balances.usdt} /></td>
                <td><AmountEdit maxValue={balances.usdt} decimalPlaces={USDT_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/gusd.png" alt="USDC" /> GUSD</td>
                <td className="text-right"><Decimal value={balances.gusd} /></td>
                <td><AmountEdit maxValue={balances.gusd} decimalPlaces={GUSD_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="asset"><img src="img/busd.png" alt="USDC" /> BUSD</td>
                <td className="text-right"><Decimal value={balances.busd} /></td>
                <td><AmountEdit maxValue={balances.busd} decimalPlaces={BUSD_DECIMALS} /></td>
              </tr>
              <tr>
                <td className="border-0 text-right" colSpan={3}>
                  <span className="text-gray-600">Manual withdrawal fee: <Decimal value={fee} decimalPlaces={2} />%</span>
                  <button onClick={(e) => contract.withdraw(balances)}>Withdraw</button></td>
              </tr>
            </tbody>
          </table>
        </>
      )
    case ContractState.Connecting:
      return (
        <p>Connecting...</p>
      )
    case ContractState.NotConnected:
      return (
        <button className="m-auto block" onClick={connect} >Connect your wallet</button>
      )
    case ContractState.Error:
      return (
        <p>Error: {error}</p>
      )
  }
}
