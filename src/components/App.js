// import Decentragram from "../abis/Decentragram.json";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import "./App.css";
import { loadBlockchainData, loadWeb3 } from "../methods";


const App = () => {
  // const [account, setAccount] = useState("");
  // const [balance, setBalance] = useState(0);
  // const [decentragram, setDecentragram] = useState(null);
  // const [images, setImages] = useState([]);
  // const [buffer, setBuffer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  React.useEffect(() => {
    loadWeb3();
    
    loadBlockchainData().then((res) => {
      setData(res)
      setLoading(false);
    });


    return () => {};
  }, []);


    
  return (
    <div>
      <Navbar balance={data.walletBalance} account={data.shortAccount} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main images={data.images} />
      )}
    </div>
  );
};

export default App;


