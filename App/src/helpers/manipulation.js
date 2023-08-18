export const convertSizeToMBGB = (sizeInBytes) => {
  const ONE_KB = 1024; // 1 kilobyte in bytes
  const ONE_MB = ONE_KB * 1024; // 1 megabyte in bytes
  const ONE_GB = ONE_MB * 1024; // 1 gigabyte in bytes

  if (sizeInBytes >= ONE_GB) {
    return `${(sizeInBytes / ONE_GB).toFixed(2)} GB`;
  } else if (sizeInBytes >= ONE_MB) {
    return `${(sizeInBytes / ONE_MB).toFixed(2)} MB`;
  } else if (sizeInBytes >= ONE_KB) {
    return `${(sizeInBytes / ONE_KB).toFixed(2)} KB`;
  } else {
    return `${sizeInBytes} bytes`;
  }
};

export const convertTimestampToDate = (blockTimestamp) => {
  const date = new Date(blockTimestamp * 1000);
  return date.toLocaleDateString();
};

export const getVerificationStatusString = (status) => {
  switch (status) {
    case 0:
      return "Not Verified";
    case 1:
      return "Verification Requested";
    case 2:
      return "Verified";
    default:
      return "Unknown";
  }
};

export const getRightsCategoryString = (category) => {
  switch (category) {
    case "0":
      return "Personal Use Only";
    case "1":
      return "Commercial Use";
    case "2":
      return "Attribution";
    case "3":
      return "Derivative Works";
    case "4":
      return "Non Transferable";
    case "5":
      return "Limited Edition";
    case "6":
      return "Educational Use";
    case "7":
      return "Resale Rights";
    case "8":
      return "Expiration";
    case "9":
      return "Region Specific";
    default:
      return "Unknown";
  }
};
