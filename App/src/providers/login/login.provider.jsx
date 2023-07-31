import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadWeb3 } from "../../helpers/login";

// export interface Status {
//   loggedStatus: boolean;
//   handleLogin: (authToken: string, errors?: string) => void;
//   handleLogout: () => void;
// }

export const loginContext = createContext({
  loggedStatus: false,
  handleLogin: () => {},
  handleLogout: () => {},
});

const LoginProvider = (props) => {
  const [loggedStatus, setLoggedStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      let isLoggedIn = false;
      try {
        isLoggedIn = await loadWeb3();
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

  const handleLogin = (authToken, errors) => {
    if (errors === "Unauthorized") {
      navigate("/");
      return;
    }

    // Perform additional logic here, such as verifying the authToken
    // and then set the loggedStatus to true if login is successful
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
    <loginContext.Provider value={{ loggedStatus, handleLogin, handleLogout }}>
      {props.children}
    </loginContext.Provider>
  );
};

export default LoginProvider;
