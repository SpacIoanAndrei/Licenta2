import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, InputGroup, Row } from "react-bootstrap";
import CustomButton from "../../components/button/CustomButton";
import CustomLoader from "../../components/loader/loader";
import { useCurrentUser } from "../../providers/currentUser.provider";
import {
  convertTimestampToDate,
  getVerificationStatusString,
} from "../../helpers/manipulation";
import {
  changeUserDetails,
  getUser,
  insertUser,
} from "../../helpers/callsContractAPI";
import "./MyProfile.css";

export const MyProfilePage = () => {
  const { usersContract, userAddress } = useContext(loginContext);
  const [loading, setLoading] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();

  const [form, setForm] = useState({
    userEmail: currentUser.userEmail,
    first_name: currentUser.firstName,
    last_name: currentUser.lastName,
    country: currentUser.country,
    description: currentUser.description,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetButton = () => {
    setForm({
      userEmail: currentUser.userEmail,
      first_name: currentUser.name,
      last_name: currentUser.name,
      country: currentUser.country,
      description: currentUser.description,
    });
  };

  const insertNewUser = async () => {
    const payload = {
      userAddress: userAddress,
      userEmail: form.userEmail,
      firstName: form.first_name,
      lastName: form.last_name,
      country: form.country,
      description: form.description,
    };
    insertUser(payload, usersContract, userAddress).then(() =>
      setLoading(false)
    );
  };
  const updateUserDetails = () => {
    console.log("update user");
    const payload = {
      userAddress: userAddress,
      userEmail: form.userEmail,
      firstName: form.first_name,
      lastName: form.last_name,
      country: form.country,
      description: form.description,
      verifyStatus: currentUser.verifyStatus,
    };
    changeUserDetails(payload, usersContract, userAddress).then(() =>
      setLoading(false)
    );
  };

  const submitButton = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    if (currentUser.index === -1) insertNewUser();
    else updateUserDetails();
  };

  useEffect(() => {
    setLoading(true);
    if (currentUser.index === -1 && usersContract && userAddress) {
      getUser(usersContract, userAddress)
        .then((parsedResult) => {
          updateCurrentUser(parsedResult);
          // setLoading(false);
        })
        .catch((error) => {
          window.alert("Complete log in process");
          setLoading(false);
        });
    } else {
      setForm({
        userEmail: currentUser.userEmail,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        country: currentUser.country,
        description: currentUser.description,
      });
      setLoading(false);
    }
  }, [currentUser, userAddress]);

  const handleRequestVerify = (nr: number) => {
    setLoading(true);
    const payload = {
      userAddress: userAddress,
      userEmail: form.userEmail,
      firstName: form.first_name,
      lastName: form.last_name,
      country: form.country,
      description: form.description,
      verifyStatus: nr,
    };
    console.log("payload", payload);
    console.log("currentUser.verifyStatus", currentUser.verifyStatus);

    changeUserDetails(payload, usersContract, userAddress).then(() => {
      getUser(usersContract, userAddress).then((parsedResult) => {
        updateCurrentUser(parsedResult);
        // setLoading(false);
      });
      setLoading(false);
    });
  };

  return (
    <div className="profile-container">
      <h1>Your account details:</h1>
      <div className="content-columns">
        <form className="container mt-3" onSubmit={submitButton}>
          <Row className="mb-3">
            <Form.Group controlId="firstName" className="col col-sm-6">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="lastName" className="col col-sm-6">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="formBasicEmail" className="col col-sm-6">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <Form.Control
                  aria-describedby="basic-addon2"
                  type="email"
                  name="userEmail"
                  value={form.userEmail}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group className=" col col-sm-6" controlId="formGridAddress1">
              <Form.Label>Country</Form.Label>
              <Form.Control
                className="form-control"
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group controlId="formGridlabel" className="col col-sm-6">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows="{3}"
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <Row className="button-rows">
            <CustomButton
              type="submit"
              variant="dark"
              title="Save"
              onClick={() => {}}
            />
            {loading && <CustomLoader />}
            <CustomButton
              type="reset"
              variant="light"
              title="Reset"
              onClick={resetButton}
            />
          </Row>
        </form>
        {currentUser.index !== -1 && (
          <>
            <div className="right-section">
              <span className="extra-info">Date of registration</span>
              {convertTimestampToDate(currentUser.dateOfRegistration)}
              <span className="extra-info">Allowed uploaded files</span>
              {currentUser.allowedUploads}
              <span className="extra-info">Status for this account</span>
              {getVerificationStatusString(currentUser.verifyStatus)}
              {currentUser.verifyStatus === 0 && (
                <CustomButton
                  onClick={() => handleRequestVerify(1)}
                  title={"Request Account Verification"}
                />
              )}
              {currentUser.verifyStatus === 1 && (
                <CustomButton
                  onClick={() => handleRequestVerify(0)}
                  title={"Cancel Account Verification"}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
