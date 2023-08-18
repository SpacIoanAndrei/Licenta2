import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadWeb3 } from "../../helpers/login";
import Users from "../../truffle_abis/Users.json";

export const loginContext = createContext({
  loggedStatus: false,
  usersContract: null,
  userAddress: "",
  userRole: 0,
  handleLogin: () => {},
  handleLogout: () => {},
});

const LoginProvider = (props) => {
  const [loggedStatus, setLoggedStatus] = useState(false);
  const [usersContract, setUsersContract] = useState();
  const [userAddress, setUserAddress] = useState();
  const [userRole, setUserRole] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      let isLoggedIn = false;
      try {
        isLoggedIn = await loadWeb3();
        if (isLoggedIn) {
          handleLogin();
        }
      } catch {
        console.log("catch");
        setLoggedStatus(false);
      }
      console.log("isLoggedIn", isLoggedIn);
      setLoggedStatus(isLoggedIn);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setLoggedStatus(true);
        navigate("/");
        handleLogin();
        // setConnectedAddress(accounts[0]);
        // User is connected, you can perform additional actions here
      } else {
        setLoggedStatus(false);
        // setConnectedAddress(null);
        // User disconnected their account, you can perform additional actions here
      }
    };

    const handleChainChanged = (chainId) => {
      // Chain changed, you can perform additional actions here if needed
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.off("accountsChanged", handleAccountsChanged);
        window.ethereum.off("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleLogin = async (authToken, errors) => {
    if (errors === "Unauthorized") {
      navigate("/");
      console.log("unauthorised");
      return;
    }

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const usersContractData = Users.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (usersContractData) {
      const usersConnectedContract = new web3.eth.Contract(
        Users.abi,
        usersContractData.address
      );

      setUsersContract(usersConnectedContract);
      //get current user
      setUserAddress(accounts[0]);
      try {
        const result = await usersConnectedContract.methods
          .getRoleForUser()
          .call();
        console.log("result", result);
        setUserRole(result);
      } catch (error) {
        window.alert("role problem.");
      }
    } else {
      window.alert("Error: Users contract not deployed (no detected network)");
    }

    setLoggedStatus(true);
  };

  const handleLogout = () => {
    // Perform any additional cleanup or logout logic here
    setLoggedStatus(false);
    console.log("LOg ouT");
    // Redirect to the homepage or any other route after logout if needed
    navigate("/");
  };

  return (
    <loginContext.Provider
      value={{
        loggedStatus,
        usersContract,
        userAddress,
        userRole,
        handleLogin,
        handleLogout,
      }}
    >
      {props.children}
    </loginContext.Provider>
  );
};

export default LoginProvider;
