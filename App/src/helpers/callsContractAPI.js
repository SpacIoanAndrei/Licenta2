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
          fileId: fileId,
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
          connectedTags: result.conenctedTags.map((tag) =>
            window.web3.utils.hexToUtf8(tag)
          ),
        });
        return result;
      })
    );
    return filesArray;
  }
};

export const editSoftDetails = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .editFilePresentation(
        payload.fileId,
        payload.fileTitle,
        payload.description,
        window.web3.utils.fromAscii(payload.country),
        payload.ownershipRights
      )
      .send({ from: userAddress });
  }
};

export const changePriceForfile = async (
  payload,
  usersContract,
  userAddress
) => {
  if (usersContract !== null) {
    console.log("payload", payload);
    const result = await usersContract.methods
      .editPrice(payload.fileId, payload.newPrice)
      .send({ from: userAddress });
  }
};

export const saveNewTags = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .addNewTagsToFile(payload.fileId, payload.newTags)
      .send({ from: userAddress });
  }
};

export const saveTagsToFile = async (payload, usersContract, userAddress) => {
  if (usersContract !== null) {
    const result = await usersContract.methods
      .addTagsToFile(payload.fileId, payload.existingTags)
      .send({ from: userAddress });
  }
};

export const getAllTagsAvailable = async (usersContract, userAddress) => {
  if (usersContract !== null) {
    const rawTags = await usersContract.methods.getAllTags().call();
    const formattedArray = rawTags.map((tag) =>
      window.web3.utils.hexToUtf8(tag)
    );
    return formattedArray;
  }
};

export const getFilesByTag = async (
  selectedTag,
  usersContract,
  userAddress
) => {
  if (usersContract !== null) {
    let filesArray = [];
    const fileIds = await usersContract.methods
      .getFilesForTag(window.web3.utils.fromAscii(selectedTag))
      .call();

    const results = await Promise.all(
      fileIds.map(async (fileId) => {
        const result = await usersContract.methods.getFile(fileId).call();
        const readableCountry = window.web3.utils.hexToUtf8(result.country);
        filesArray.push({
          fileId: fileId,
          fileTitle: result.fileTitle,
          fileReference: result.fileReference,
          fileSize: parseInt(result.fileSize),
          fileType: result.fileType,
          description: result.description,
          country: readableCountry,
          ownershipRights: result.ownershipRights,
          uploadDate: result.uploadDate,
          likes: parseInt(result.likes),
          pastOwners: result.pastOwners,
          priceForTransfer: result.priceForTransfer,
          connectedTags: result.conenctedTags.map((tag) =>
            window.web3.utils.hexToUtf8(tag)
          ),
        });
        return result;
      })
    );
    return filesArray;
  }
};
