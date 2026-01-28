import logo from "./logo.svg";
import "bulma/css/bulma.min.css";
import "./App.css";
import React, { useEffect, useState, useCallback } from "react";
import web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(0);

  const displayAccounts = () => {
    if (accounts.length > 0) {
      return (
        <div className="accounts">
          {accounts.map((element, index) => (
            <p key={index}>
              {element.address} - [{element.balance}] ETH
            </p>
          ))}
        </div>
      );
    } else {
      return <div className="accounts">No accounts connected</div>;
    }
  };

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider();

      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        try {
          await provider.request({ method: "eth_requestAccounts" });
        } catch {
          console.error("can not connect metamask");
        }
      } else if (provider == null && !process.env.production) {
        console.log("connect to Ganache");
        provider = new web3.providers.HttpProvider("http://localhost:8545");
      } else {
        console.error("Please install MetaMask!");
      }

      const contract = await loadContract("Faucet", provider);
      setweb3Api({
        provider,
        web3: new web3(provider),
        contract,
      });
    };
    loadProvider();
  }, []);

  const getAccounts = async () => {
    if (web3Api.web3) {
      const accounts = await web3Api.web3.eth.getAccounts();

      const accountsWithBalance = await Promise.all(
        accounts.map(async (address) => {
          const balanceWei = await web3Api.web3.eth.getBalance(address);
          const balanceEth = web3Api.web3.utils.fromWei(balanceWei, "ether");

          return {
            address,
            balance: balanceEth,
          };
        }),
      );

      setAccounts(accountsWithBalance);
    }
  };

  const loadBalance = async () => {
    const { contract, web3 } = web3Api;

    if (contract && web3) {
      const balance = await web3.eth.getBalance(contract._address);
      const eth = web3.utils.fromWei(balance, "ether");
      setBalance(eth);
    }
  };

  useEffect(() => {
    getAccounts();
    loadBalance();
  }, [web3Api]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.methods.addFunds().send({
      from: accounts[0].address,
      value: web3.utils.toWei("1", "ether"), // 1 ETH
    });

    await getAccounts();
    await loadBalance();
  }, [web3Api, accounts]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.methods.withdraw(web3.utils.toWei("0.1", "ether")).send({
      from: accounts[0].address,
    });

    await getAccounts();
    await loadBalance();
  }, [web3Api, accounts]);

  return (
    <>
      <div className="faucet-app">
        <div className="faucet-wrapper">
          <div className="faucet">
            <div className="balance-view is-size-2">
              Current Balance: <strong>{balance}</strong> ETH
            </div>

            <button className="button mr-2" onClick={addFunds}>
              Donate
            </button>
            <button className="button" onClick={withdraw}>
              Withdraw
            </button>
            <div className="faucet-accounts">{displayAccounts()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
