import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  FaCog,
  FaComments,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessage } from "../../context/MessageContext";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { unreadCount } = useMessage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <img
            src="/logo192.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="CampusTrade Logo"
          />
          CampusTrade
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/marketplace">
              <FaShoppingCart className="me-1" /> Marketplace
            </Nav.Link>

            {user && user.isVerified && (
              <>
                <Nav.Link as={Link} to="/transactions">
                  Transactions
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/messages"
                  className="position-relative"
                >
                  <FaComments className="me-1" /> Messages
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    <FaCog className="me-1" /> Admin
                  </Nav.Link>
                )}

                <NavDropdown
                  title={
                    <>
                      <FaUser className="me-1" />
                      {user.name}
                    </>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile?tab=listings">
                    My Listings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
