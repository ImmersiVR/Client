import { useEffect, useState, useContext } from "react";
import "./Star.css";
import { ethers } from "ethers";
import faucetContract from "../ethereum/faucet";
import { UserContext } from "../../App";
import CustomCursor from "./StarChips.png";
export default function Rewards() {
  const [walletAddress, setWalletAddress] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [rewards, setRewards] = useState(0);
  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);
  useEffect(() => {
    if (state) {
      setRewards(state.rewards);
    }
  }, [state]);
  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_requestAccounts", []);
        /* get signer */
        setSigner(provider.getSigner());
        /* local contract instance */
        setFcContract(faucetContract(provider));
        /* set active wallet address */
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* get provider */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */
          setFcContract(faucetContract(provider));
          /* set active wallet address */
          setWalletAddress(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getOCTHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.requestTokens(rewards);
      setWithdrawSuccess("Operation succeeded - enjoy your tokens!");
      setTransactionData(resp.hash);

      fetch("/collectRewards", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt_NITR"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          localStorage.setItem(
            "user_NITR",
            JSON.stringify({ ...state, rewards: result.rewards })
          );
          dispatch({ type: "UPDATEREW", payload: result.rewards });
        });
    } catch (err) {
      setWithdrawError(err.message);
    }
  };

  return (
    <div className="me">
      <div
        className="content2 row"
        style={{ color: "white", fontSize: "50px" }}
      >
        <img
          src={CustomCursor}
          alt=""
          style={{
            width: "380px",
            height: "100px",
          }}
        />
      </div>
      <div
        className="outerboxx content1"
        style={{
          cursor: `url(${CustomCursor}),hover`,
        }}
      >
        <div
          className="card auth-card input-field mysec2"
          style={{
            opacity: "0.9",
            paddingLeft: "100px",
            paddingRight: "100px",
            borderRadius: "10px",
            boxShadow: "inset 0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <p
            style={{
              fontSize: "40px",
              color: "#313638",
              margin: "15px",
              marginBottom: "40px",
              borderRadius: "10px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            {rewards}
          </p>

          <div
            className=" written "
            onClick={connectWallet}
            style={{ cursor: "pointer" }}
          >
            {walletAddress && walletAddress.length > 0
              ? `Connected`
              : "Connect Wallet"}
          </div>

          <div
            className=" written"
            disabled={walletAddress ? false : true}
            onClick={() => {
              getOCTHandler();
            }}
            style={{ marginBottom: "5px", cursor: "pointer" }}
          >
            Collect
          </div>
        </div>
      </div>
      {/* <div className="outerboxx content1">
        <div className="innner">
          <p className="rewardBox" style={{ fontSize: "50px", color: "white" }}>
            {rewards}
          </p>

          <button type="button" className=""></button>
          <div className="written" onClick={connectWallet}>
            {" "}
            {walletAddress && walletAddress.length > 0
              ? `  Connected`
              : "Connect Wallet"}
          </div>
          <button type="button"></button>
          <div
            className=" written"
            onClick={getOCTHandler}
            disabled={walletAddress ? false : true}
          >
            Collect
          </div>
        </div>
      </div> */}
    </div>
  );
}
