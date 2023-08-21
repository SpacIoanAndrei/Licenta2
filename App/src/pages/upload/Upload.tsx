import React, { useContext, useRef, useState } from "react";
import { Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import CustomButton from "../../components/button/CustomButton";
import CustomLoader from "../../components/loader/loader";
import "./Upload.css";
import { convertSizeToMBGB } from "../../helpers/manipulation";
import { loginContext } from "../../providers/login/login.provider";
import { storeFile } from "../../helpers/callsContractAPI";
const { create } = require("ipfs-http-client");

export const RightsCategory = {
  PersonalUseOnly: 0,
  CommercialUse: 1,
  Attribution: 2,
  DerivativeWorks: 3,
  NonTransferable: 4,
  LimitedEdition: 5,
  EducationalUse: 6,
  ResaleRights: 7,
  Expiration: 8,
  RegionSpecific: 9,
};

export const UploadPage = () => {
  async function ipfsClient() {
    const projectId = "2U4Gw2cBNqMFqFjbl3w1xUpqsl3";
    const projectSecret = "18adbe6374b547256cfbfafc886b1a12";
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const ipfs = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
    return ipfs;
  }

  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fileTitle: "",
    fileReference: "",
    fileSize: 0,
    fileType: "",
    description: "",
    country: "",
    ownershipRights: 0,
    priceForTransfer: "",
  });
  const [loading, setLoading] = useState(false);
  const { usersContract, userAddress } = useContext(loginContext);
  const excludedTypes = ["application/x-msdownload", "application/x-dosexec"];

  const handleDrag = function(
    e: React.DragEvent<HTMLFormElement | HTMLDivElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  // let uplfl: File | undefined;
  const [uplfl, setUplfl] = useState<File | undefined>();
  const handleDrop = function(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // handleFiles(e.dataTransfer.files);
      if (excludedTypes.includes(e.dataTransfer.files[0].type)) {
        window.alert("This file type is not allowed.");
      } else {
        setFormData({
          ...formData,
          fileType: e.dataTransfer.files[0].type,
          fileSize: e.dataTransfer.files[0].size,
        });
        setUplfl(e.dataTransfer.files[0]);
      }
    }
  };

  // triggers when file is selected with click
  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (excludedTypes.includes(e.target.files[0].type)) {
        window.alert("This file type is not allowed.");
      } else {
        setFormData({
          ...formData,
          fileType: e.target.files[0].type,
          fileSize: e.target.files[0].size,
        });
        setUplfl(e.target.files[0]);
      }

      // handleFiles(e.target.files);
    }
  };

  const handleTextChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleSelect = (evt: any) => {
    setFormData({ ...formData, ownershipRights: evt });
  };

  const submitButton = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    let cid = "";
    //upload to ipfs
    if (uplfl) {
      let ipfs = await ipfsClient();
      try {
        const fileForUpload = new Blob([uplfl], {
          type: uplfl.type,
        });

        const result = await ipfs.add(fileForUpload);
        cid = result.cid.toString();
      } catch (error) {
        console.error("Error uploading file to IPFS:", error);
      }
    }
    console.log("cid", cid);
    if (cid.length > 0 && uplfl) {
      //save to blockchain
      const payload = {
        userAddress: userAddress,
        fileTitle: formData.fileTitle,
        fileReference: cid,
        fileSize: uplfl.size,
        fileType: uplfl.type,
        description: formData.description,
        country: formData.country,
        ownershipRights: formData.ownershipRights,
        priceForTransfer: formData.priceForTransfer,
      };
      storeFile(payload, usersContract, userAddress).then(() =>
        setLoading(false)
      );
    }
    //no more get the file from ipfs: QmY1kYk3tDtwgJojMy8bgM5GRWp5GvCKNE1j4Chkd4BB8s
    //no more get the image from ipfs: QmePTXBtrjUPny3ShMM2Vj5DaYFLHfRRYyNkYTgYcVtCjr
    //get the archive from ipfs:QmNX3cvQJqgkmWJu1dsKsHWmJB987N6756QxmUPQAVk9us

    setLoading(false);
    // alert("No files selected");
  };

  const findPropertyNameByValue = (newValue: number) => {
    let selectedKey = "";
    Object.entries(RightsCategory).forEach(([key, value], index) => {
      if (value == newValue) selectedKey = key;
    });
    return selectedKey;
  };
  return (
    <div className="upload-file-container">
      <h1>Enter details about the files you want to upload:</h1>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={submitButton}
      >
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
          <Form.Group controlId="priceForTransfer" className="col">
            <Form.Label>Price For Transfer</Form.Label>
            <Form.Control
              type="number"
              name="priceForTransfer"
              value={formData.priceForTransfer}
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
              <Dropdown.Item eventKey="0">Personal Use Only</Dropdown.Item>
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
              value={formData.fileType}
              onChange={handleTextChange}
              className="form-control"
            />
          </Form.Group>
          <Form.Group controlId="fileSize" className="col">
            <Form.Label>File size</Form.Label>
            <Form.Control
              type="text"
              name="fileSize"
              value={convertSizeToMBGB(formData.fileSize)}
              onChange={handleTextChange}
              className="form-control"
            />
          </Form.Group>
        </Row>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={false} //true for adding more than a element
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            {formData.fileTitle.length !== 0 && (
              <p>Selected file: {formData.fileTitle}</p>
            )}
            {formData.fileTitle.length !== 0 && <p> Change file</p>}
            {formData.fileTitle.length === 0 && (
              <p>Drag and drop your file here or</p>
            )}
            {formData.fileTitle.length === 0 && (
              <button className="upload-button" onClick={onButtonClick}>
                Upload a file
              </button>
            )}
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
        <Row className="button-rows">
          <CustomButton
            type="submit"
            variant="dark"
            title="Upload"
            onClick={() => {}}
          />
          {loading && <CustomLoader />}
        </Row>
      </form>
    </div>
  );
};
