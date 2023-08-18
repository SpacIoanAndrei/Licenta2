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

export const storeFile = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    console.log("payload", payload);
    const result = await usersContract.methods
      .addFile(
        payload.userAddress,
        payload.fileTitle,
        payload.fileReference,
        payload.fileSize,
        payload.fileType,
        payload.description,
        window.web3.utils.fromAscii(payload.country),
        payload.ownershipRights,
        payload.priceForTransfer
      )
      .send({ from: userAddress });
  }
};

export const getPersonalFiles = async (usersContract, userAddress) => {
  let filesArray = [];
  if (usersContract !== null) {
    const fileIds = await usersContract.methods
      .getFilesForAddress(userAddress)
      .call();
    const results = await Promise.all(
      fileIds.map(async (fileId) => {
        const result = await usersContract.methods.getFile(fileId).call();
        filesArray.push({
          fileTitle: result.fileTitle,
          fileReference: result.fileReference,
          fileSize: parseInt(result.fileSize),
          fileType: result.fileType,
          description: result.description,
          country: window.web3.utils.hexToUtf8(result.country),
          ownershipRights: result.ownershipRights,
          uploadDate: result.uploadDate,
          likes: parseInt(result.likes),
          pastOwners: result.pastOwners,
          priceForTransfer: result.priceForTransfer,
        });
        return result;
      })
    );
    // console.log("payload", results);
    return filesArray;
  }
};
