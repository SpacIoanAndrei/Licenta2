/* eslint-disable no-undef */
const Users = artifacts.require("Users");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Users", ([owner, accounts]) => {
  //All the code goes here for testing
  let users;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    users = await Users.new();
  });

  describe("User permissions", async () => {
    it("Should return true for an unregistered user", async () => {
      const userAddress = owner;
      const isRegistered = await users.isUser(userAddress);
      assert.equal(isRegistered, false);
    });

    it("Should return true for a registered user", async () => {
      const userAddress = owner;
      const userEmail = web3.utils.asciiToHex("example@example.com");
      const firstName = "Andrei";
      const lastName = "Spac";
      const country = web3.utils.asciiToHex("Romania");
      const description = "User description test";

      // Insert the user using the insertUser function
      await users.insertUser(
        userAddress,
        userEmail,
        firstName,
        lastName,
        country,
        description
      );

      const isInserted = await users.isUser(userAddress);
      assert.equal(isInserted, true);
    });

    it("Correct admin status and permissions", async () => {
      const addresss = await users.getRoleForUser(owner);

      assert.equal(addresss, 3);
    });
  });
  describe("User actions", async () => {
    it("User count incremented", async () => {
      const isIncremented = await users.getUserCount();

      assert.equal(isIncremented, 1);
    });
    it("Correct index update for an insert ", async () => {
      const addresss = await users.getUserAtIndex(0);

      assert.equal(addresss, owner);
    });
    it("Additional details are pre-set correctly", async () => {
      const detAccount = await users.getUser(owner);

      assert.equal(detAccount.allowedUploads, 5);
      assert.equal(detAccount.verifyStatus, 0);
      assert.equal(detAccount.uploadingInProgess, false);
    });
    it("Change verify status to Requested", async () => {
      const userAddress = owner;
      const userEmail = web3.utils.asciiToHex("example@example.com");
      const firstName = "Andrei";
      const lastName = "Spac";
      const country = web3.utils.asciiToHex("Romania");
      const description = "User description test";
      const verifyStatus = 1;

      const detAccountChanged = await users.updateUser(
        userAddress,
        userEmail,
        firstName,
        lastName,
        country,
        description,
        verifyStatus
      );

      const detAccount = await users.getUser(owner);
      assert.equal(detAccountChanged.receipt.status, true);
      assert.equal(detAccount.verifyStatus, 1);
    });
    it("Change verify status to Approved", async () => {
      const userAddress = owner;
      const allowedUploads = 10;
      const verifyStatus = 2;

      const detAccountChanged = await users.updateUserByAdmin(
        userAddress,
        allowedUploads,
        verifyStatus
      );

      const detAccount = await users.getUser(owner);
      assert.equal(detAccountChanged.receipt.status, true);
      assert.equal(detAccount.verifyStatus, 2);
      assert.equal(detAccount.allowedUploads, 10);
    });
    it("Set verify status to Approved, no limit change", async () => {
      const userAddress = owner;
      const allowedUploads = 10;
      const verifyStatus = 1;

      await users.updateUserByAdmin(userAddress, allowedUploads, verifyStatus);
      const isSetVerified = await users.setVerified(userAddress);
      assert.equal(isSetVerified.receipt.status, true);
    });
  });
  describe("Actions on files", async () => {
    it("Add a file and return a valid index", async () => {
      const userAddress = owner;
      const fileTitle = "test Document";
      const fileReference = "test555";
      const fileSize = 1024;
      const fileType = "pdf";
      const description = "Document description test";
      const country = web3.utils.asciiToHex("Romania");
      const ownershipRights = 1;
      const priceForTransfer = web3.utils.toWei("250000000000000000", "ether");

      const newIndex = await users.addFile(
        userAddress,
        fileTitle,
        fileReference,
        fileSize,
        fileType,
        description,
        country,
        ownershipRights,
        priceForTransfer
      );

      assert.equal(
        newIndex.logs[0].args.index,
        0,
        "File added on the correct index"
      );
    });
    it("File details are set correctly", async () => {
      const detFile = await users.getFile(0);

      assert.equal(detFile.fileTitle, "test Document");
      assert.equal(detFile.likes, 0);
      assert.equal(detFile.fileSize, 1024);
    });
    it("Likes are incremented", async () => {
      await users.changeLike(0, 2);
      const detFile = await users.getFile(0);

      assert.equal(detFile.likes, 2);
    });
    it("New price is registered", async () => {
      const priceForTransfer = web3.utils.toWei("350000000000000000", "ether");
      await users.editPrice(0, priceForTransfer);
      const detFile = await users.getFile(0);
      const priceForTransferArray = [
        web3.utils.toWei("250000000000000000", "ether"),
        web3.utils.toWei("350000000000000000", "ether"),
      ];
      assert.equal(detFile.priceForTransfer[0], priceForTransferArray[0]);
      assert.equal(detFile.priceForTransfer[1], priceForTransferArray[1]);
    });
    it("Save and add tags", async () => {
      const detFile = await users.addNewTagsToFile(0, [
        web3.utils.asciiToHex("tag"),
        web3.utils.asciiToHex("tag2"),
      ]);

      assert.equal(detFile.receipt.status, true);

      // assert.equal(
      //   detFile.connectedTags[0],
      //   web3.utils.hexToUtf8("tag")
      // );
      // assert.equal(
      //   detFile.connectedTags[1],
      //   web3.utils.hexToUtf8("tag2")
      // );
    });
    it("Search by tag", async () => {
      const tagFiles = await users.getAllTags();

      assert.equal(web3.utils.hexToUtf8(tagFiles[0]), "tag");
      assert.equal(web3.utils.hexToUtf8(tagFiles[1]), "tag2");
    });
  });
});
