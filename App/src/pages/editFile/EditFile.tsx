import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import { loginContext } from "../../providers/login/login.provider";
import { useFiles } from "../../providers/files.provider";
import CustomLoader from "../../components/loader/loader";
import CustomButton from "../../components/button/CustomButton";
import "./EditFile.css";
import {
  changePriceForfile,
  editSoftDetails,
  getAllTagsAvailable,
  saveNewTags,
  saveTagsToFile,
} from "../../helpers/callsContractAPI";
import { RightsCategory } from "../upload/Upload";
import {
  convertSizeToMBGB,
  tagsStringToArray,
} from "../../helpers/manipulation";

export const EditFilePage = () => {
  const { userAddress, usersContract } = useContext(loginContext);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState({
    fileId: -1,
    fileTitle: "",
    fileReference: "",
    fileSize: 0,
    fileType: "",
    description: "",
    country: "",
    ownershipRights: 0,
    uploadDate: 0,
    likes: 0,
    pastOwners: [""],
    priceForTransfer: [0],
    connectedTags: [""],
  });
  const [arrayOfTags, setArrayOfTags] = useState([""]);
  const [newTagsToLink, setNewTagsToLink] = useState();
  const [oldTagsToLink, setOldTagsToLink] = useState();

  const { personalFiles, updateFiles } = useFiles();
  const [newPrice, setNewPrice] = useState(0);

  const [formData, setFormData] = useState({
    fileId: selectedFile.fileId,
    fileTitle: selectedFile.fileTitle,
    description: selectedFile.description,
    country: selectedFile.country,
    ownershipRights: selectedFile.ownershipRights,
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customString = searchParams.get("customId");

  useEffect(() => {
    const thisFile = personalFiles.find((file: any) => {
      if (
        file.fileReference === customString &&
        file.fileReference === sessionStorage.getItem("reference")
      )
        return file;
    });

    if (thisFile !== undefined) {
      getAllTagsAvailable(usersContract, userAddress).then((result) => {
        setArrayOfTags(result);
      });
      setSelectedFile(thisFile);
      setFormData({
        fileId: thisFile.fileId,
        fileTitle: thisFile.fileTitle,
        description: thisFile.description,
        country: thisFile.country,
        ownershipRights: thisFile.ownershipRights,
      });
      setNewPrice(
        thisFile.priceForTransfer[thisFile.priceForTransfer.length - 1]
      );
    }
  }, []);

  const handleTextChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e: any) => {
    setNewPrice(e.target.value);
  };

  const oldTagsChange = (e: any) => {
    setOldTagsToLink(e.target.value);
  };

  const handleNewTagsChange = (e: any) => {
    setNewTagsToLink(e.target.value);
  };

  const priceChange = () => {
    setLoading(true);
    const payload = {
      fileId: selectedFile.fileId,
      newPrice,
    };
    changePriceForfile(payload, usersContract, userAddress).then(() => {
      setLoading(false);
      const newPricesArray = [...selectedFile.priceForTransfer, newPrice];
      setSelectedFile({ ...selectedFile, priceForTransfer: newPricesArray });
    });
  };

  const fileOldTagsChange = () => {
    setLoading(true);
    const payload = {
      fileId: selectedFile.fileId,
      existingTags: tagsStringToArray(oldTagsToLink),
    };
    console.log("payload", payload);
    saveTagsToFile(payload, usersContract, userAddress).then(() => {
      setLoading(false);
    });
  };

  const fileNewTagsChange = () => {
    setLoading(true);
    const payload = {
      fileId: selectedFile.fileId,
      newTags: tagsStringToArray(newTagsToLink),
    };
    saveNewTags(payload, usersContract, userAddress).then(() => {
      setLoading(false);
    });
  };

  const submitButton = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (selectedFile.fileId >= 0) {
      const payload = {
        fileId: selectedFile.fileId,
        fileTitle: formData.fileTitle,
        description: formData.description,
        country: formData.country,
        ownershipRights: formData.ownershipRights,
      };
      editSoftDetails(payload, usersContract, userAddress).then(() =>
        setLoading(false)
      );
    }
    setLoading(false);
  };

  const findPropertyNameByValue = (newValue: number) => {
    let selectedKey = "";
    Object.entries(RightsCategory).forEach(([key, value], index) => {
      if (value == newValue) selectedKey = key;
    });
    return selectedKey;
  };

  const handleSelect = (evt: any) => {
    setFormData({ ...formData, ownershipRights: evt });
  };
  console.log("how", selectedFile);

  return (
    <div className="editFile-container">
      {selectedFile.fileReference.length !== 0 ? (
        <>
          <div className="edit1-call">
            <form id="form-file-upload" onSubmit={submitButton}>
              <Row className="mb-3">
                <Form.Group controlId="fileTitle" className="col ">
                  <Form.Label>File Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="fileTitle"
                    value={formData.fileTitle}
                    onChange={handleTextChange}
                    className="form-control"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="formGridlabel" className="col">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleTextChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="country" className="col">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleTextChange}
                    className="form-control"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="formDropdown" className="col">
                  <Form.Label>
                    Selected Rights Category:{" "}
                    {findPropertyNameByValue(formData.ownershipRights)}
                  </Form.Label>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title="Rights Category"
                    onSelect={handleSelect}
                  >
                    <Dropdown.Item eventKey="0">
                      Personal Use Only
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="1">Commercial Use</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Attribution</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Derivative Works</Dropdown.Item>
                    <Dropdown.Item eventKey="4">Non-Transferable</Dropdown.Item>
                    <Dropdown.Item eventKey="5">LimitedEdition</Dropdown.Item>
                    <Dropdown.Item eventKey="6">EducationalUse</Dropdown.Item>
                    <Dropdown.Item eventKey="7">ResaleRights</Dropdown.Item>
                    <Dropdown.Item eventKey="8">Expiration</Dropdown.Item>
                    <Dropdown.Item eventKey="9">RegionSpecific</Dropdown.Item>
                  </DropdownButton>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="fileType" className="col">
                  <Form.Label>File type</Form.Label>
                  <Form.Control
                    type="text"
                    name="fileType"
                    value={selectedFile.fileType}
                    onChange={handleTextChange}
                    className="form-control"
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="fileSize" className="col">
                  <Form.Label>File size </Form.Label>
                  <Form.Control
                    type="text"
                    name="fileSize"
                    value={convertSizeToMBGB(selectedFile.fileSize)}
                    onChange={handleTextChange}
                    className="form-control"
                    readOnly
                  />
                </Form.Group>
              </Row>

              <Row className="edit-fle-button-rows">
                <CustomButton
                  type="submit"
                  variant="dark"
                  title="Update"
                  onClick={() => {}}
                />
              </Row>
            </form>
          </div>
          {loading && (
            <div className="edit-both-loader">
              <CustomLoader />
            </div>
          )}
          <div className="edit2-call">
            <div>
              History of price for transfer:{" "}
              {selectedFile.priceForTransfer.map((price, index) =>
                index === selectedFile.priceForTransfer.length - 1
                  ? `${price}.`
                  : `${price}, `
              )}
            </div>
            <div className="change-price-wrapper">
              <div>Current price: </div>
              <input
                style={{
                  height: "38px",
                  padding: "6px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                }}
                type="number"
                defaultValue={newPrice}
                name="newPrice"
                onChange={handlePriceChange}
              />
              <CustomButton
                type="submit"
                variant="dark"
                title="Change price"
                onClick={priceChange}
              />
            </div>
          </div>
          <div className="edit3-call">
            <div>
              Available tags:{" "}
              {arrayOfTags.map((tag, index) =>
                index === selectedFile.priceForTransfer.length - 1
                  ? `'${tag}'. `
                  : `'${tag}', `
              )}
            </div>
            <div>
              Tags linked to your file:{" "}
              {selectedFile.connectedTags.map((tag, index) =>
                index === selectedFile.priceForTransfer.length - 1
                  ? `'${tag}'. `
                  : `'${tag}', `
              )}
            </div>
            <div className="change-tags-wrapper">
              <div>
                Link tags to your file <br />
              </div>
              <textarea
                style={{
                  height: "38px",
                  padding: "6px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                }}
                defaultValue={""}
                name="textTags"
                onChange={oldTagsChange}
              />
              <CustomButton
                type="submit"
                variant="dark"
                title="Add tags"
                onClick={fileOldTagsChange}
              />
              <div>
                New Tags to link to your file <br />
                (Write tags separated by a comma and a space):
              </div>
              <textarea
                style={{
                  height: "38px",
                  padding: "6px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                  minHeight: "70px",
                }}
                defaultValue={""}
                name="textTags"
                onChange={handleNewTagsChange}
              />
              <CustomButton
                type="submit"
                variant="dark"
                title="Add new tags"
                onClick={fileNewTagsChange}
              />
            </div>
          </div>
        </>
      ) : (
        <h1>Choose the file you want to modify from My files section.</h1>
      )}
    </div>
  );
};
