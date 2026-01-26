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
import {
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = { status: filter };
      const response = await adminAPI.getReports(params);
      setReports(response.data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const updateReportStatus = async (status) => {
    try {
      await adminAPI.updateReportStatus(selectedReport._id, {
        status,
        adminNotes: adminNotes || undefined,
      });

      toast.success(`Report marked as ${status}`);
      fetchReports();
      setShowModal(false);
      setSelectedReport(null);
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to update report status");
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.reporterId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      "Under Review": "info",
      Resolved: "success",
      Rejected: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getReasonBadge = (reason) => {
    const colors = {
      "Inappropriate Content": "danger",
      "Fraudulent Activity": "dark",
      Harassment: "danger",
      "Prohibited Item": "warning",
      "Misleading Information": "info",
      Other: "secondary",
    };
    return <Badge bg={colors[reason]}>{reason}</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Report Management</h4>
        <div className="d-flex gap-3">
          <div style={{ width: "250px" }}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          <Form.Select
            style={{ width: "200px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
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
                <th>ID</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report._id}>
                  <td>{report._id.substring(0, 8)}...</td>
                  <td>{report.reporterId?.name}</td>
                  <td>{report.reportedUserId?.name || "N/A"}</td>
                  <td>{getReasonBadge(report.reason)}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleReview(report)}
                        title="Review Report"
                      >
                        <FaEye />
                      </Button>

                      {report.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleReview(report)}
                            title="Mark as Resolved"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReview(report)}
                            title="Reject Report"
                          >
                            <FaTimes />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredReports.length === 0 && (
            <Alert variant="info" className="text-center">
              No reports found matching your criteria.
            </Alert>
          )}
        </>
      )}

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Review Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <div className="mb-4">
                <h5>Report Details</h5>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Report ID:</strong>
                      </td>
                      <td>{selectedReport._id}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Reporter:</strong>
                      </td>
                      <td>
                        {selectedReport.reporterId?.name} (
                        {selectedReport.reporterId?.email})
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Reported User:</strong>
                      </td>
                      <td>
                        {selectedReport.reportedUserId?.name
                          ? `${selectedReport.reportedUserId.name} (${selectedReport.reportedUserId.email})`
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Listing:</strong>
                      </td>
                      <td>
                        {selectedReport.listingId?.title
                          ? selectedReport.listingId.title
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Reason:</strong>
                      </td>
                      <td>{getReasonBadge(selectedReport.reason)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Status:</strong>
                      </td>
                      <td>{getStatusBadge(selectedReport.status)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Created:</strong>
                      </td>
                      <td>
                        {new Date(selectedReport.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              <div className="mb-4">
                <h5>Description</h5>
                <div className="border rounded p-3 bg-light">
                  {selectedReport.description}
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaExclamationTriangle className="me-2" />
                  Admin Notes
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter your notes or action taken..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedReport?.status === "Pending" && (
            <>
              <Button
                variant="danger"
                onClick={() => updateReportStatus("Rejected")}
              >
                Reject Report
              </Button>
              <Button
                variant="success"
                onClick={() => updateReportStatus("Resolved")}
              >
                Mark as Resolved
              </Button>
            </>
          )}
          {selectedReport?.status !== "Pending" && (
            <Button
              variant="primary"
              onClick={() => updateReportStatus(selectedReport.status)}
            >
              Update Notes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportManagement;
