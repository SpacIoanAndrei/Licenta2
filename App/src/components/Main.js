import React, { Component } from "react";
import tether from "../tether.png";

class Main extends Component {
  render() {
    console.log(this.props.tetherBalance);
    return (
      <div id="content" className="mt-3">
        <table className="table text-muted tect-center">
          <thead>
            <tr style={{ color: "black" }}>
              <th scope="col">staking balance</th>
              <th scope="col">reward balance</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ color: "black" }}>
              <td>
                {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
                USDT
              </td>
              <td>
                {window.web3.utils.fromWei(this.props.rwdBalance, "Ether")} RWD
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-2" style={{ opacity: ".9" }}>
          <form className="mb-3">
            <div style={{ borderSpacing: "0 1em" }}>
              <label className="float-left" style={{ marginLeft: "15px" }}>
                <b>Stake tokens</b>
              </label>
              <span className="float-right" style={{ marginLeft: "8px" }}>
                Balance:{" "}
                {window.web3.utils.fromWei(this.props.tetherBalance, "Ether")}
              </span>
              <div className="input-group mb-4">
                <input type="text" placeholder="0" required />
                <div className="input-group-open">
                  <div className="input-group-text">
                    <img alt="tether" src={tether} height="32px" />
                    &nbsp;&nbsp;&nbsp; USDT
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Deposit
              </button>
            </div>
          </form>
          <button className="btn btn-primary btn-lg btn-block">Withdraw</button>
          <div className="card-body text-center">AIRDROP</div>
        </div>
      </div>
    );
  }
}

export default Main;
