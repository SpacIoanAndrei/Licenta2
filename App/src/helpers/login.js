import Web3 from "web3";

export const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "No ethereum web browser detected! Add MetaMask extension for full experience."
    );
    return false;
  }
  return true;
};

export const isMetaMask = () => {
  return typeof window.ethereum !== "undefined";
};
