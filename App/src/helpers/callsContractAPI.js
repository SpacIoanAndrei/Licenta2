export const insertUser = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .insertUser(
        payload.userAddress,
        window.web3.utils.fromAscii(payload.userEmail),
        payload.name,
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
        payload.name,
        window.web3.utils.fromAscii(payload.country),
        payload.description,
        payload.verifyStatus
      )
      .send({ from: userAddress });
  }
};

export const getUser = async (usersContract, userAddress) => {
  try {
    const result = await usersContract.methods.getUser(userAddress).call();
    const parsedUserModel = {
      userEmail: window.web3.utils.hexToUtf8(result.userEmail),
      dateOfRegistration: parseInt(result.dateOfRegistration),
      name: result.name,
      country: window.web3.utils.hexToUtf8(result.country),
      description: result.description,
      allowedUploads: parseInt(result.allowedUploads),
      index: parseInt(result.index),
      verifyStatus: parseInt(result.verifyStatus),
      uploadingInProgress: result.uploadingInProgess,
    };
    return parsedUserModel;
  } catch (error) {
    window.alert("Save details about your account in Profile page.");
  }
  return;
};
