// import logo from './logo.svg';
import "./App.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
// import axios from "axios";

function App() {
  // wagmi hooks
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync } = useConnect();

  // route param
  const { walletType } = useParams();

  const WALLET_TYPES = {
    metamask: "wallet-metamask",
    walletconnect: "wallet-walletconnect",
  };

  useEffect(() => {
    // console.log("walletType param: " + walletType);

    switch (walletType) {
      case WALLET_TYPES.metamask:
        connectMetamaskWallet();
        break;
      case WALLET_TYPES.walletconnect:
        connectWalletConnectWallet();
        break;
      default:
        console.error("Wallet Type not found!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [""]);

  const connectMetamaskWallet = async () => {
    try {
      console.log("Connecting Metamask Wallet...");

      // disconnects the web3 provider if it's already active
      // metamask does not support programmatically disconnecting a wallet
      if (isConnected) {
        await disconnectAsync();
      }

      // enabling the web3 provider metamask
      // connect wallet to get public wallet address
      const { account, chain } = await connectAsync({
        connector: new InjectedConnector(),
      });

      console.log("Wallet Connected Successfully!");
      console.log("Wallet Account:", account);
      console.log("Wallet Chain:", chain);

      await requestSignatureMessage(account, chain);
    } catch (error) {
      console.error("Error in connectMetamaskWallet!", error);
    }
  };

  function connectWalletConnectWallet() {
    console.log("Connecting WalletConnect Wallet...");
  }

  const requestSignatureMessage = async (walletAddress, chain) => {
    try {
      console.log(
        "Req Sign URL: " +
          process.env.REACT_APP_AUTH_SERVER_URL +
          process.env.REACT_APP_REQUEST_MESSAGE_ENDPOINT
      );

      const requestMessageOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-API-KEY": process.env.REACT_APP_MORALIS_WEB3_API_KEY,
        },
        body: JSON.stringify({
          timeout: 15,
          domain: process.env.REACT_APP_DOMAIN,
          chainId: chain.id,
          address: walletAddress,
          uri: process.env.REACT_APP_DOMAIN_URI,
        }),
      };

      // request message to sign from server
      const response = await fetch(
        process.env.REACT_APP_AUTH_SERVER_URL +
          process.env.REACT_APP_REQUEST_MESSAGE_ENDPOINT,
        requestMessageOptions
      );
      const jsonResponse = await response.json();
      console.log("Signature Request Succesful!", jsonResponse);
      const messageToSign = jsonResponse.message;
      // signing the received message via metamask
      const signature = await signMessageAsync({ message: messageToSign });
      console.log("User signed successfully:", signature);

      const verifySignatureOptions = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-API-KEY": process.env.REACT_APP_MORALIS_WEB3_API_KEY,
        },
        body: JSON.stringify({ message: messageToSign, signature: signature }),
      };

      // verify signature
      const res = await fetch(
        process.env.REACT_APP_AUTH_SERVER_URL +
          process.env.REACT_APP_VERIFY_SIGNATURE_ENDPOINT,
        verifySignatureOptions
      );
      console.log("res:", res);

      if (res.status === 201) {
        const jsonRes = await res.json();
        console.log("Signature Verification Succesful!", jsonRes);
        alert("Signature Verification Succesful!");

        // window.location.href =
        //   process.env.REACT_APP_IONIC_APP_BASE_URL +
        //   "/auth/callback?token=" +
        //   jsonRes.profileId;
        window.location.href =
          process.env.REACT_APP_IONIC_APP_BASE_URL +
          "/auth/callback?token=" +
          walletAddress;
      } else {
        throw Error("Signature Verification Failed!");
      }
    } catch (error) {
      console.error("Error in requestSignatureMessage!", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <p>Loading...</p>
        <p>
          <a
            href={process.env.REACT_APP_IONIC_APP_BASE_URL}
            className="App-link"
          >
            Go Back
          </a>
        </p>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
