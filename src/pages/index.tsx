import React, { Dispatch, useContext, useState } from "react"
import BigNumber from "bignumber.js";
import { ProviderState } from "../utils/web3modal";
import { IoWarningOutline, IoHelpCircleOutline } from 'react-icons/io5';
import { useContract, EarningContract, USDC_DECIMALS, DAI_DECIMALS, USDT_DECIMALS, GUSD_DECIMALS, BUSD_DECIMALS, Balances } from "../utils/contract";
import Decimal from "../components/decimal";
import AmountEdit from "../components/amount-edit";
import Web3Context from "../contexts/web3-context";

export default (props) => {
  const { providerState, account, library, setError, activate } = useContext(Web3Context);
  const { isActive, contract, balances, fee, connect } = useContract(providerState, account, library, activate);
  
  return  (
    <>
      <h2>Earning withdrawal tool</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <WarningMessage>
            This tool is not official and is not endorsed by the Nash team. Use at your own risk!
          </WarningMessage>
          <p>As you may know, on the mobile app, the Nash earning product only allow to cash out to fiat.
          But earning is non-custodial, which means that it's possible to withdraw your stablecoin tokens
          at any time by interacting directly with the blockchain.</p>
          <p>This tool allows you to call a method on the earning smart contract that will withdraw your
            aTokens from Aave and transfer the correponding stablecoins to your wallet.</p>
          <Content
            isActive={isActive}
            contract={contract}
            providerState={providerState}
            balances={balances}
            fee={fee}
            setError={setError}
            connect={connect} />
        </div>

        <div>
          <InfoMessage title="FAQ">
            <dl>
              <dt>Will I get my aTokens, or the underlying?</dt>
              <dd>The Nash earning manual withdrawal smart contract method has been designed to
                withdraw the aTokens from Aave, so you will get the respective underlying tokens
                corresponding to the aTokens you have.</dd>

              <dt>Do I need ETH in my wallet to withdraw my aTokens?</dt>
              <dd>Yes, a smart contract method will be called to trigger the withdrawal, and,
                as every interaction with the Ethereum blockchain, you need to pay fees.
                Also, keep in mind that your aTokens will be withdrawn from Aave, and that
                kind of operations are quite costly.
              </dd>

              <dt>What is the manual withdrawal fee?</dt>
              <dd>Nash charges a small fee when manually withdrawing to a personal wallet.
                At the time of writing that fee is 1%, but Nash has the ability to change it
                int the future. If you connect with your wallet, you will be able to see
                the actual fee amount.
              </dd>

              <dt>Can I analyse this tool source code?</dt>
              <dd>Yes, of course! The source code od this tool is avaliable
                on <a href="https://github.com/acatinon/nash-earnings-toolkit">Github</a>.</dd>

              <dt>Can I download a copy of this tool and store an offline version?</dt>
              <dd>Yes, of course!</dd>
            </dl>
          </InfoMessage>          
        </div>

      </div>
      
    </>
  );
}

const InfoMessage = (props) => {
  if (props.children) {
    return (
      <div className="bg-sky-50 border-l-2 border-sky-500 p-2">
        <h3 className="flex items-center text-sky-500"><IoHelpCircleOutline className="mt-0.5 text-xl" />{props.title}</h3>
        <div>{props.children}</div>
      </div>
    )
  }
  return null;
}

const WarningMessage = (props) => {
  if (props.children) {
    return (
      <div className="bg-amber-50 border-l-2 border-amber-500 p-2 mb-4">
        <h3 className="flex items-center text-amber-500"><IoWarningOutline className="mt-0.5 text-xl" />Warning</h3>
        <div>{props.children}</div>
      </div>
    )
  }
  return null;
}

enum TransactionState {
  NotStarted,
  Pending,
  Success,
  Error
}

interface ContentProps {
  isActive: boolean;
  contract: EarningContract;
  providerState: ProviderState;
  balances: Balances;
  fee: BigNumber;
  setError: Dispatch<Error>;
  connect: () => void;
}

const Content = (props: ContentProps) => {
  const [transactionState, setTransactionState] = useState(TransactionState.NotStarted);
  const [transactionHash, setTransactionHash] = useState(null);

  const onWithdraw = async (e) => {
    setTransactionState(TransactionState.Pending);
    props.contract.withdraw(props.balances)
      .then((response) => {
        response.wait()
        .then((receipt) => {
          setTransactionHash(receipt.transactionHash);
          setTransactionState(TransactionState.Success);
        })
        .catch((error) => {
          debugger;
          props.setError(error);
          setTransactionState(TransactionState.Error);
        });
      })
      .catch((error) => {
        debugger;
        props.setError(error);
        setTransactionState(TransactionState.Error);
      });
  }

  switch (props.providerState) {
    case ProviderState.Init:
      return null;
    case ProviderState.NotConnected:
      return (
        <button className="my-10 primary m-auto block" onClick={props.connect} >Connect your wallet</button>
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
              <td className="asset"><img src="img/usdc.png" alt="USDC" /> aUSDC</td>
              <td className="text-right"><Decimal value={props.balances.usdc} /></td>
              <td><AmountEdit maxValue={props.balances.usdc} decimalPlaces={USDC_DECIMALS} /></td>
            </tr>
            <tr>
              <td className="asset"><img src="img/dai.png" alt="USDC" /> aDAI</td>
              <td className="text-right"><Decimal value={props.balances.dai} /></td>
              <td><AmountEdit maxValue={props.balances.dai} decimalPlaces={DAI_DECIMALS} /></td>
            </tr>
            <tr>
              <td className="asset"><img src="img/usdt.png" alt="USDC" /> aUSDT</td>
              <td className="text-right"><Decimal value={props.balances.usdt} /></td>
              <td><AmountEdit maxValue={props.balances.usdt} decimalPlaces={USDT_DECIMALS} /></td>
            </tr>
            <tr>
              <td className="asset"><img src="img/gusd.png" alt="USDC" /> aGUSD</td>
              <td className="text-right"><Decimal value={props.balances.gusd} /></td>
              <td><AmountEdit maxValue={props.balances.gusd} decimalPlaces={GUSD_DECIMALS} /></td>
            </tr>
            <tr>
              <td className="asset"><img src="img/busd.png" alt="USDC" /> aBUSD</td>
              <td className="text-right"><Decimal value={props.balances.busd} /></td>
              <td><AmountEdit maxValue={props.balances.busd} decimalPlaces={BUSD_DECIMALS} /></td>
            </tr>
            <tr>
              <td className="p-0 py-2 border-0 text-right" colSpan={3}>
                <span className="text-gray-600">Manual withdrawal fee: <Decimal value={props.fee} decimalPlaces={2} />%</span>
                &nbsp;
                <button className="primary" onClick={onWithdraw}>Withdraw</button></td>
            </tr>
          </tbody>
        </table>
      )    
  }
}
