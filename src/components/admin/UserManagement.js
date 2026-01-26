import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaBan, FaCheck, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const statusMap = {
        suspend: "suspended",
        activate: "active",
        ban: "banned",
      };

      const newStatus = statusMap[actionType];

      await adminAPI.updateUserStatus(selectedUser._id, {
        status: newStatus,
        reason: reason || undefined,
      });

      toast.success(`User ${actionType}ed successfully`);
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
      setReason("");
    } catch (error) {
      toast.error(`Failed to ${actionType} user`);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      suspended: "warning",
      banned: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    return role === "admin" ? (
      <Badge bg="primary">Admin</Badge>
    ) : (
      <Badge bg="secondary">User</Badge>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>User Management</h4>
        <div style={{ width: "300px" }}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleAction(user, "suspend")}
                          title="Suspend User"
                        >
                          <FaBan />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAction(user, "activate")}
                          title="Activate User"
                        >
                          <FaCheck />
                        </Button>
                      )}

                      {user.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction(user, "ban")}
                          title="Ban User"
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredUsers.length === 0 && (
            <Alert variant="info" className="text-center">
              No users found matching your search.
            </Alert>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "suspend" && "Suspend User"}
            {actionType === "activate" && "Activate User"}
            {actionType === "ban" && "Ban User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {actionType} user{" "}
            <strong>{selectedUser?.name}</strong>?
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Reason (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for this action..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "ban" ? "danger" : "warning"}
            onClick={confirmAction}
          >
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
