import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [balance, setBalance] = useState();
  const [logedin, setlogedin] = useState(false);
  const [userString, setuserString] = useState();
  const [inputvalue, setinputvalue] = useState();
  const [amountvalue, setAmoutvalue] = useState();
  const web3 = new Web3(Web3.givenProvider);

/* useEffect */
  useEffect(() => {
    if (localStorage.getItem("userid") !== null) {
      getUserId();
      getBalance();
    }
    // window.web3.currentProvider
  }, [logedin]);

/* GET NETWORK ID */
  const getNetworkId = async () => {
    return await web3.eth.net.getId();
  };

/* SWITCH NETWORK ID */
  const swichNetwork = async (chainId) => {
    const currentChainId = await getNetworkId();

    if (currentChainId !== chainId) {
      try {
        await web3.currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.toHex(chainId) }],
        });
        await connectmass();
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          alert("add this chain id");
        }
      }
    }
  };

/*CALLBACK OF CONNECT WITH META MASK */
  const connector = async () => {
    try {
      //get userid and setting it in local storage
      await web3.eth.requestAccounts().then((result) => {
        localStorage.setItem("userid", result[0]);
        setlogedin(true);
        toast.success("Connected SuccessFully");
      });
    } catch (err) {
      console.log(err);
    }
  };
/*  CONNECT WITH META MASK */
  const connectmass = async () => {
    if (window.web3.currentProvider) {
      if ((await web3.eth.net.getId()) === 3) {
        await connector();
      } else {
        await swichNetwork(3);
      }
    } else {
      alert("Download 🦊 Metamask in extension");
    }
  };
/* GET BALANCE */
  const getBalance = async () => {
    //get balance using userid
    await web3.eth.getBalance(localStorage.getItem("userid")).then((res) => {
      //coverting from decimal to ether format
      setBalance(web3.utils.fromWei(res, "ether"));
    });
  };
/* GET WALLED ID */
  const getUserId = async () => {
    const wordis = localStorage.getItem("userid");
    const temp =
      wordis.substring(1, 6) + "..." + wordis.substring(wordis.length - 3);
    setuserString(temp);
  };
/* DISCONNECT WALLET */
  const disconnect = async () => {
    localStorage.removeItem("userid");
    toast.error("Disconnected SuccessFully");
    setlogedin(false);
    window.location.reload();
  };
/* SEND TRANSACTION */
  const sendTransaction = async () => {
    if (localStorage.getItem("userid") === null) {
      toast.error("please connect to your wallet");
    } else {
      var adrs = document.getElementById("address").value;
      const userAdd = inputvalue;
      const newAmountValue = document.getElementById("amount").value;
      if (localStorage.getItem("userid") === null) {
        toast.error("Connect to your account");
      }
      if (adrs === "") {
        toast.error("enter user id");
      } else if (newAmountValue === "") {
        toast.error("enter user amount");
      } else if (newAmountValue == 0) {
        toast.error("enter user amount above `0`");
      } else {
        try {
          console.log(userAdd);
          localStorage.getItem("userid") === null
            ? toast.error("Connect to your account")
            : await web3.eth.sendTransaction(
                {
                  from: localStorage.getItem("userid"),
                  to: userAdd,
                  value: web3.utils.toWei(newAmountValue.toString(), "ether"),
                },
                function (err, transactionHash) {
                  if (!err) console.log(transactionHash + " success");
                }
              );
        } catch (error) {
          console.log(error, "errir");
          toast.error(error);
          toast.error("invalid wallet id  or insufficient amount ");
        }
      }
    }
  };
  return (
    <>
      <>
        <nav className="navbar bg-light">
          <div className="container-fluid">
            <a className="navbar-brand">Navbar</a>
            {localStorage.getItem("userid") === null ? (
              <button
                onClick={connectmass}
                className="btn btn-outline-success"
                type="submit"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="btn-group ml-2">
                <button
                  type="button"
                  className="btn btn-danger dropdown-toggle"
                  data-toggle="dropdown"
                >
                  Action
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item">Balance : {balance}</a>
                  <a className="dropdown-item">
                    User : <small>{userString}</small>
                  </a>
                  <a className="dropdown-item" onClick={disconnect}>
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>
      </>

      <div className="mb-3">
        <h4>Send Coins</h4>
        <br></br>

        <label className="form-label">Enter Receiver wallet id</label>
        <input
          type="text"
          id="address"
          className="form-control"
          placeholder="receiver wallet id"
          onChange={(e) => {
            setinputvalue(e.target.value);
          }}
        />
        <br></br>
        <label className="form-label">Amout</label>
        <input
          id="amount"
          type="number"
          className="form-control"
          placeholder="Amount"
          onChange={(e) => {
            setAmoutvalue(e.target.value);
          }}
        />
        <br></br>
        <button
          type="button"
          className="btn btn-success"
          onClick={sendTransaction}
        >
          Send
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
