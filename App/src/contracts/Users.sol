// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract Users {

    // Data used for roles and security
  address public owner;
  bytes32 private constant Admin = keccak256(abi.encodePacked("Admin"));
  bytes32 private constant Read = keccak256(abi.encodePacked("Read"));
  bytes32 private constant Write = keccak256(abi.encodePacked("Write"));
  mapping(bytes32 => mapping(address => bool)) public roles;
  event GrantRole(bytes32 indexed role, address indexed account);
  event RemoveRole(bytes32 indexed role, address indexed account);

    // Data used to store information about users and their assets
  enum RightsCategory {
    PersonalUseOnly,
    CommercialUse,
    Attribution,
    DerivativeWorks,
    NonTransferable,
    LimitedEdition,
    EducationalUse,
    ResaleRights,
    Expiration,
    RegionSpecific
  }
  enum VerificationStatus {
    NotVerified,
    InProgress,
    Verified
  }
  struct UploadedFile {
    string fileTitle;
    string fileReference;
    uint fileSize;
    string fileType;
    string description;
    bytes32 country;
    RightsCategory ownershipRights;
    uint uploadDate;
    uint likes;
    address[] pastOwners;
    uint[] priceForTransfer;
  }
  struct UserModelStruct {
    bytes32 userEmail;
    uint dateOfRegistration;
    string name;
    bytes32 country;
    string description;
    uint allowedUploads;
    uint index;
    VerificationStatus verifyStatus;
    bool uploadingInProgess;
  }
  mapping(address => UserModelStruct) private userModels;
  address[] private userPointer;
  event CreatedUser(address indexed userAddress, uint index, bytes32 userEmail);
  event UpdatedUser(address indexed userAddress, uint index, bytes32 userEmail);
  event DeletedUser(address userAddress, uint index);
  event LogUpdateUserByAdmin(address indexed userAddress, uint index, uint allowedUploads, VerificationStatus verifyStatus);

  uint fileCounter;
  mapping(uint => UploadedFile) files;
  mapping(address => uint[]) personalUserfiles;
  mapping(string => uint[]) tagFiles;
  string[] tags;

  event AddedFile(string fileReference, uint index);
  event TransferredFile(address oldOwner, address newOwner, uint fileId);

  constructor() public {
    owner = msg.sender;
    _grantRole(Admin, msg.sender);
  }
///----------------------------------------------------- ROLES LOGIC -----------------------------------------
  modifier onlyRole (bytes32 _role) {
    require(roles[_role][msg.sender], "Not authorized!");
    _;
  }

  function _grantRole(bytes32 _role, address _account) internal {
    if (_role==Admin){
        roles[Admin][_account]=true;
        roles[Read][_account]=true;
        roles[Write][_account]=true;
    } else if (_role==Write){
        roles[Read][_account]=true;
        roles[Write][_account]=true;
    } else {
        roles[_role][_account]=true;
    }

    emit GrantRole(_role, _account);
  }

  function grantAdminRole(address _account) external onlyRole(Admin) {
    require(_account != address(0), "Roles: account is the zero address!");
    require(!roles[Admin][_account], "This address already has this role!");
    if (msg.sender == owner) {
        _grantRole(Admin, _account);
    }
    else {
        revert("Admin could not set another admin role");
    }
  }

  function grantWriteRole(address _account) external onlyRole(Admin) {
    require(_account != address(0), "Roles: account is the zero address!");
    require(!roles[Write][_account], "This address already has this role!");
    _grantRole(Write, _account);
  }

  function grantReadRole(address _account) external onlyRole(Admin) {
    require(_account != address(0), "Roles: account is the zero address!");
    require(!roles[Read][_account], "This address already has this role!");
    _grantRole(Read, _account);
  }

  function _deleteRole(bytes32 _role, address _account) internal {
    if (_role==Admin){
        roles[Admin][_account]=false;
        roles[Read][_account]=false;
        roles[Write][_account]=false;
    } else if (_role==Write){
        roles[Read][_account]=false;
        roles[Write][_account]=false;
    } else {
        roles[_role][_account]=false;
    }

    emit RemoveRole(_role, _account);
  }

  function deleteAdminRole(address _account) external onlyRole(Admin) {
    require(roles[Admin][_account], "This address does not have the role to be revoked.");
    if (msg.sender == owner) {
        _deleteRole(Admin, _account);
    }
    else {
        revert("Admin not authorized to delete owner");
    }
  }
  function deleteWriteRole(address _account) external onlyRole(Admin) {
    require(roles[Write][_account], "This address does not have the role to be revoked.");
    _deleteRole(Write, _account);
  }

  function deleteReadRole(address _account) external onlyRole(Admin) {
    require(roles[Read][_account], "This address does not have the role to be revoked.");
    _deleteRole(Read, _account);
  }

///----------------------------------------------------- ROLES LOGIC END--------------------------------------
  
////***************************************************** USER LOGIC  ******************************************
  function isUser(address userAddress) public view returns(bool isRegistered) { //view: do not alter the state of the contract or the blockchain in any way.
    if(userPointer.length == 0) return false;
    return (userPointer[userModels[userAddress].index] == userAddress);
  }

  function getUserCount() public view returns(uint count)
  {
    return userPointer.length;
  }

  function getUserAtIndex(uint index) public view returns(address userAddress)
  {
    return userPointer[index];
  }

  function insertUser(address userAddress, 
    bytes32 userEmail,
    string memory name,
    bytes32 country,
    string memory description) public returns(uint index) {
    require(!isUser(userAddress), "User address is already used");
    userModels[userAddress].userEmail = userEmail;
    userModels[userAddress].name = name;
    userModels[userAddress].country = country;
    userModels[userAddress].description = description;

    userModels[userAddress].dateOfRegistration = block.timestamp;
    userModels[userAddress].allowedUploads = 5;
    userModels[userAddress].index = userPointer.length;
    userModels[userAddress].verifyStatus = VerificationStatus.NotVerified;
    userModels[userAddress].uploadingInProgess = false;

    userPointer.push(userAddress);

    _grantRole(Write, userAddress);
    emit CreatedUser(userAddress, userModels[userAddress].index, userEmail);
    return userPointer.length-1;
  }

  function getUser(address userAddress) public view
    returns(UserModelStruct memory)
  {
    require(isUser(userAddress), "User address is not initialized");
    return userModels[userAddress];
  }

  function deleteUser(address userAddress) public returns(uint index){
    require(isUser(userAddress), "User address is not initialized"); 
    uint rowToDelete = userModels[userAddress].index;
    address keyToMove = userPointer[userPointer.length-1];
    userPointer[rowToDelete] = keyToMove;
    userModels[keyToMove].index = rowToDelete; 
    userPointer.pop();
    emit DeletedUser(
        userAddress, 
        rowToDelete);
    emit UpdatedUser(
        keyToMove, 
        rowToDelete, 
        userModels[keyToMove].userEmail);
    return rowToDelete;
  }

  function updateUserByAdmin(address userAddress, uint allowedUploads, VerificationStatus verifyStatus) external onlyRole(Admin) returns(bool success) 
  {
    userModels[userAddress].allowedUploads = allowedUploads;
    userModels[userAddress].verifyStatus = verifyStatus;
    emit LogUpdateUserByAdmin(
      userAddress, 
      userModels[userAddress].index,
      userModels[userAddress].allowedUploads,
      userModels[userAddress].verifyStatus);
    return true;
  }

  function updateUser(address userAddress, 
    bytes32 userEmail,
    string calldata name,
    bytes32 country,
    string calldata description,
    VerificationStatus verifyStatus) external returns(bool success) 
  {
    require(isUser(userAddress), "User address is not initialized");
    require(verifyStatus != VerificationStatus.Verified, "Not allowed to set this status");
    userModels[userAddress].userEmail = userEmail;
    userModels[userAddress].name = name;
    userModels[userAddress].country = country;
    userModels[userAddress].description = description;
    userModels[userAddress].verifyStatus = verifyStatus;
    emit UpdatedUser(
      userAddress, 
      userModels[userAddress].index,
      userModels[userAddress].userEmail);
    return true;
  }

  function setVerified(address userAddress) external onlyRole(Admin) returns(bool isRegistered) { 
    require(isUser(userAddress), "User address is not initialized");
    userModels[userAddress].verifyStatus = VerificationStatus.Verified;
    return true;
  }

////***************************************************** USER LOGIC END ***************************************

//##################################################### FILES LOGIC  ##########################################

  function getFilesForAddress(address userAddress) public view returns(uint[] memory filesForAddress){
    return personalUserfiles[userAddress];
  }

  function getFilesForTag(string memory tag) public view returns(uint[] memory filesForTag){
    return tagFiles[tag];
  }

  function addNewTagsToFile(uint fileId, string[] memory newTags) public onlyRole(Write) returns(bool areTagsAdded) {
    require(fileId < fileCounter, "No file has this id");
    for (uint i = 0; i < newTags.length; i++) {
      tags.push(newTags[i]);
      tagFiles[newTags[i]].push(fileId);
    }
    return true;
  }

  function addTagsToFile(uint fileId, string[] memory existingTags) public onlyRole(Write) returns(bool areTagsAdded) {
    require(fileId < fileCounter, "No file has this id");
    for (uint i = 0; i < existingTags.length; i++) {
      tagFiles[existingTags[i]].push(fileId);
    }
    return true;
  }

  function addFile(address userAddress, 
    string memory fileTitle,
    string memory fileReference,
    uint fileSize,
    string memory fileType,
    string memory description,
    bytes32 country,
    RightsCategory ownershipRights,
    uint priceForTransfer) public onlyRole(Write) returns(uint index) {

    require(isUser(userAddress), "User address is not initialized");
    files[fileCounter].fileTitle = fileTitle;
    files[fileCounter].fileReference = fileReference;
    files[fileCounter].fileSize = fileSize;
    files[fileCounter].fileType = fileType;
    files[fileCounter].description = description;
    files[fileCounter].country = country;
    files[fileCounter].ownershipRights = ownershipRights;
    files[fileCounter].uploadDate = block.timestamp;
    files[fileCounter].likes = 0;
    files[fileCounter].pastOwners.push(userAddress);
    files[fileCounter].priceForTransfer.push(priceForTransfer);

    personalUserfiles[userAddress].push(fileCounter);
    userModels[userAddress].uploadingInProgess = false;

    emit AddedFile(fileReference, fileCounter);
    fileCounter++;
    return fileCounter-1;
  }
  
  function editFilePresentation( uint fileId,
    string memory fileTitle,
    string memory description,
    bytes32 country,
    RightsCategory ownershipRights) public onlyRole(Write) returns(uint index) {
    require(fileId < fileCounter, "No file has this id");

    files[fileId].fileTitle = fileTitle;
    files[fileId].description = description;
    files[fileId].country = country;
    files[fileId].ownershipRights = ownershipRights;

    return fileId;
  }

  function editFileTehnical( uint fileId,
    string memory fileReference,
    uint fileSize,
    string memory fileType) public onlyRole(Write) returns(uint index) {
    require(fileId < fileCounter, "No file has this id");

    files[fileId].fileReference = fileReference;
    files[fileId].fileSize = fileSize;
    files[fileId].fileType = fileType;

    return fileId;
  }


  //edit price for transfer
  function editPrice( uint fileId, uint newPrice) external onlyRole(Write) returns(uint index) {
    require(fileId < fileCounter, "No file has this id");
    files[fileId].priceForTransfer.push(newPrice);
    return fileId;
  }
  //add like
    function changeLike ( uint fileId, uint increaseByAmount) external onlyRole(Write) returns(uint index) {
    require(fileId < fileCounter, "No file has this id");
    files[fileId].likes = files[fileId].likes + increaseByAmount;
    return fileId;
  }

  //called by owner ; should this be modified to be called by the buyer?
  function changeOwnerFile(address newUserAddress, uint fileId) public onlyRole(Write) returns(uint index){
    require(fileId < fileCounter, "No file has this id");
    //money
    require(files[fileId].priceForTransfer[files[fileId].priceForTransfer.length-1] < newUserAddress.balance);
    //old owner
    for (uint i = 0; i < personalUserfiles[msg.sender].length; i++) {
      if (personalUserfiles[msg.sender][i] == fileId) {
        personalUserfiles[msg.sender][i] = personalUserfiles[msg.sender][personalUserfiles[msg.sender].length - 1];

        personalUserfiles[msg.sender].pop();
        break;
      }
    }
    //history
    files[fileId].pastOwners.push(newUserAddress);
    //new owner
    personalUserfiles[newUserAddress].push(fileId);
    emit TransferredFile(msg.sender, newUserAddress, fileId);
    return fileId;
  }

//##################################################### FILES LOGIC END #######################################
}