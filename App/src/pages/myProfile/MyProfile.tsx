import React, { useContext, useEffect, useState } from "react";
import { loginContext } from "../../providers/login/login.provider";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, InputGroup, Row } from "react-bootstrap";
import "./MyProfile.css";
import CustomButton from "../../components/button/CustomButton";
import CustomLoader from "../../components/loader/loader";

export const MyProfilePage = () => {
  const { loggedStatus, handleLogin, handleLogout } = useContext(loginContext);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userEmail: "",
    first_name: "",
    last_name: "",
    country: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetButton = () => {
    setForm({
      userEmail: "",
      first_name: "",
      last_name: "",
      country: "",
      description: "",
    });
  };

  const submitButton = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(form);
  };

  useEffect(() => {
    console.log("call to get user account details");
  }, []);

  return (
    <div className="profile-container">
      <h1>Your account details:</h1>
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
    </div>
  );
};
