// import logo from './logo.svg';
import "./App.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function App() {
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
        console.log("Wallet Type not found!");
    }
  }, [WALLET_TYPES.metamask, WALLET_TYPES.walletconnect, walletType]);

  function connectMetamaskWallet() {
    console.log("Connecting Metamask Wallet...");
  }

  function connectWalletConnectWallet() {
    console.log("Connecting WalletConnect Wallet...");
  }

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
