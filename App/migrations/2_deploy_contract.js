/* eslint-disable no-undef */

const Users = artifacts.require("Users");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Users);
};
