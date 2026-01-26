import { useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import {
  FaFlag,
  FaShoppingCart,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import Dashboard from "../components/admin/Dashboard";
import ListingManagement from "../components/admin/ListingManagement";
import ReportManagement from "../components/admin/ReportManagement";
import UserManagement from "../components/admin/UserManagement";

const AdminPage = () => {
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <Container fluid className="px-0">
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className="bg-dark text-white"
          style={{ width: "250px", minHeight: "calc(100vh - 73px)" }}
        >
          <div className="p-4">
            <h4 className="mb-4">Admin Panel</h4>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link
                  eventKey="dashboard"
                  active={activeKey === "dashboard"}
                  onClick={() => setActiveKey("dashboard")}
                  className="text-white mb-2"
                >
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="users"
                  active={activeKey === "users"}
                  onClick={() => setActiveKey("users")}
                  className="text-white mb-2"
                >
                  <FaUsers className="me-2" />
                  User Management
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="listings"
                  active={activeKey === "listings"}
                  onClick={() => setActiveKey("listings")}
                  className="text-white mb-2"
                >
                  <FaShoppingCart className="me-2" />
                  Listing Management
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="reports"
                  active={activeKey === "reports"}
                  onClick={() => setActiveKey("reports")}
                  className="text-white"
                >
                  <FaFlag className="me-2" />
                  Report Management
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow-1 p-4">
          <Tab.Content>
            <Tab.Pane eventKey="dashboard" active={activeKey === "dashboard"}>
              <Dashboard />
            </Tab.Pane>
            <Tab.Pane eventKey="users" active={activeKey === "users"}>
              <UserManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="listings" active={activeKey === "listings"}>
              <ListingManagement />
            </Tab.Pane>
            <Tab.Pane eventKey="reports" active={activeKey === "reports"}>
              <ReportManagement />
            </Tab.Pane>
          </Tab.Content>
        </div>
      </div>
    </Container>
  );
};

export default AdminPage;
