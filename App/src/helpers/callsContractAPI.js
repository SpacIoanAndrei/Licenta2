export const insertUser = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .insertUser(
        payload.userAddress,
        window.web3.utils.fromAscii(payload.userEmail),
        payload.firstName,
        payload.lastName,
        window.web3.utils.fromAscii(payload.country),
        payload.description
      )
      .send({ from: userAddress });
  }
};

export const changeUserDetails = async (
  payload,
  usersContract,
  userAddress
) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .updateUser(
        payload.userAddress,
        window.web3.utils.fromAscii(payload.userEmail),
        payload.firstName,
        payload.lastName,
        window.web3.utils.fromAscii(payload.country),
        payload.description,
        payload.verifyStatus
      )
      .send({ from: userAddress });
  }
};

export const getUser = async (usersContract, userAddress) => {
  const result = await usersContract.methods.getUser(userAddress).call();
  const parsedUserModel = {
    userEmail: window.web3.utils.hexToUtf8(result.userEmail),
    dateOfRegistration: parseInt(result.dateOfRegistration),
    firstName: result.firstName,
    lastName: result.lastName,
    country: window.web3.utils.hexToUtf8(result.country),
    description: result.description,
    allowedUploads: parseInt(result.allowedUploads),
    index: parseInt(result.index),
    verifyStatus: parseInt(result.verifyStatus),
    uploadingInProgress: result.uploadingInProgess,
  };
  return parsedUserModel;
};
