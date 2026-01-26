import logo from "./logo.svg";
import "bulma/css/bulma.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

function App() {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
  });
  const [accounts, setAccounts] = useState([]);

  const displayAccounts = () => {
    if (accounts.length > 0) {
      return (
        <div className="accounts">
          {accounts.map((element, index) => (
            <p key={index}>{element}</p>
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

      setweb3Api({
        provider,
        web3: new web3(provider),
      });
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      if (web3Api.web3) {
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccounts(accounts);
      }
    };

    getAccounts();
  }, [web3Api]);

  return (
    <>
      <div className="faucet-app">
        <div className="faucet-wrapper">
          <div className="faucet">
            <div className="balance-view is-size-2">
              Current Balance: <strong>10</strong> ETH
            </div>

            <button className="button mr-2">Donate</button>
            <button className="button">Withdraw</button>
            <div className="faucet-accounts">{displayAccounts()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
