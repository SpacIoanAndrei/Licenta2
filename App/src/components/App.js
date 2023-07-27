/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
import Navbar from "./navbar/Navbar";
import Web3 from "web3";
import Tether from "../truffle_abis/Tether.json";
import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import StakingInitApp from "./StakingInitApp";
import "./App.css";

const App = () => {
  let myState = {
    account: "0x0",
    tether: {},
    rwd: {},
    decentralBank: {},
    tetherBalance: "0",
    rwdBalance: "0",
    stakingBalance: "0",
  };

  const [loading, setLoading] = useState(true);

  const setMyState = (newState) => {
    myState = { ...myState, ...newState };
  };

  useEffect(() => {
    const loadData = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    loadData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum web browser detected! Check out MetaMask");
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();

    console.log("myState", myState);

    setMyState({ ...myState, account: account[0] });

    const networkId = await web3.eth.net.getId();

    const x = await window.web3.eth.getBalance(myState.account);
    console.log("getBalance", x.toString());

    // Load tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      setMyState({ tether });
      let tetherBalance = await tether.methods
        .balanceOf(myState.account)
        .call();
      setMyState({ tetherBalance: tetherBalance.toString() });
      console.log("tetherBalance", myState);
    } else {
      window.alert("Error: Tether contract not deployed (no detected network)");
    }

    myState.tether.methods
      .approve("0x21BA204D74281300cBEC2b12701240A627AB8727", 1000000)
      .send({ from: "0x21BA204D74281300cBEC2b12701240A627AB8727" }) // Replace 'yourAccountAddress' with the address of the account that is calling this function
      .then((receipt) => {
        // Transaction successful, do something with the receipt
        console.log("Transaction successful:", receipt);
      });

    let result = await myState.tether.methods
      .transferFrom(
        "0x21BA204D74281300cBEC2b12701240A627AB8727",
        "0x159FBBD2c26823eA224D37B262c528C10c4feE44",
        1000000
      )
      .send({
        from: "0x21BA204D74281300cBEC2b12701240A627AB8727", // Replace with the sender's address (must match the 'from' address above)
        gas: 500000, // Replace with the desired gas amount
      });
    console.log("result", result);
    // Load rwd contract
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      setMyState({ rwd });
      let rwdBalance = await rwd.methods.balanceOf(myState.account).call();
      setMyState({ rwdBalance: rwdBalance.toString() });
      // console.log("RWD balance", rwdBalance);
    } else {
      window.alert("Error: RWD contract not deployed (no detected network)");
    }

    // Load DecentralBank contract
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      setMyState({ decentralBank });
      //   let stakingBalance = await decentralBank.methods
      //     .stakingBalance(myState.account)
      //     .call();
      //   setMyState({ stakingBalance: stakingBalance.toString() });
      //   console.log("balance", stakingBalance);
    } else {
      window.alert(
        "Error: DecentralBank contract not deployed (no detected network)"
      );
    }

    setLoading(false);
    console.log("finalState", myState);
  };

  //stake + unstake funtions with impl from decentralBank
  const stakeTokens = (amount) => {
    setMyState({ loading: true });
    myState.tether.methods
      .approve(myState.decentralBank._address, amount)
      .send({ from: myState.account })
      .on("transactionHash", (hash) => {
        myState.decentralBank.methods
          .depositTokens(amount)
          .send({ from: myState.account })
          .on("transactionHash", (hash) => {
            setMyState({ loading: false });
          });
      });
  };

  const content = loading ? (
    <p id="loader" className="text-center" style={{ margin: "30px" }}>
      Loading...
    </p>
  ) : (
    <StakingInitApp
      tetherBalance={myState.tetherBalance}
      rwdBalance={myState.rwdBalance}
      stakingBalance={myState.stakingBalance}
      stakeTokens={stakeTokens}
    />
  );
  return (
    <div className="text-center">
      <Navbar account={myState.account} />
      <div className="container-fluid mt-5">
        <div className="'row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px", minHeight: "100vm" }}
          >
            <div>{content}</div>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              onClick={() => {
                // console.log(
                //   myState.tether.methods
                //     .balanceOf(myState.account)
                //     .call()
                // );
                // console.log("accout", account);
                // console.log(window.web3.eth.getBalance(account));
              }}
            >
              Deposit
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
