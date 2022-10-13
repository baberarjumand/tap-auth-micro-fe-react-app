import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import reportWebVitals from './reportWebVitals';

import {
  createClient,
  configureChains,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const router = createBrowserRouter([
  {
    path: "/:walletType",
    // element: <div>Hello world!</div>,
    element: <App />,
  },
  // {
  //   path: "/",
  //   // element: <div>Hello world!</div>,
  //   element: <App></App>,
  // },
]);

const { provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: false,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>

  <WagmiConfig client={client}>
    {/* <React.StrictMode> */}
      <RouterProvider router={router} />
    {/* </React.StrictMode> */}
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
