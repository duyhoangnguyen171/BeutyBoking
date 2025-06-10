import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { getUserById } from "../../services/UserService"; // Import API function

const UserView = ({ show, onHide, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && userId) {
      setLoading(true);
      setError(null);
      getUserById(userId)
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch user data");
          setLoading(false);
        });
    }
  }, [show, userId]);

  if (loading) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Loading User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Spinner animation="border" />
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user && (
          <div>
            <img
              src={
                user.imageUrl ||
                "https://www.w3schools.com/w3images/avatar2.png"
              }
              alt={`${user.firstName} ${user.lastName}`}
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <div>
              <h5>
                {user.firstName} {user.lastName}
              </h5>
              <p>Email: {user.email}</p>
              <p>Mobile: {user.mobile}</p>
              <p>Department: {user.department}</p>
              <p>Gender: {user.gender}</p>
              <p>Date of Birth: {user.dateOfBirth}</p>
              <p>Permanent: {user.isPermanent ? "Yes" : "No"}</p>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserView;
