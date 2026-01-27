import { Col, Container, Row } from "react-bootstrap";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUniversity,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="fw-bold mb-3">
              <FaUniversity className="me-2" />
              CampusTrade
            </h5>
            <p className="text-light">
              A secure student-to-student marketplace platform exclusively for
              Addis Ababa University students.
            </p>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/marketplace"
                  className="text-light text-decoration-none"
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-light text-decoration-none">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms" className="text-light text-decoration-none">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-light text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="fw-bold mb-3">Contact Info</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                Addis Ababa University, 4 Kilo
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                <a 
                  href="mailto:ambachewelbethe7@gmail.com" 
                  className="text-light text-decoration-none"
                >
                  ambachewelbethe7@gmail.com
                </a>
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                <a 
                  href="tel:+251965075087" 
                  className="text-light text-decoration-none"
                >
                  +251965075087
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="bg-light my-4" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} CampusTrade - Addis Ababa
              University. All rights reserved.
            </p>
            <p className="text-muted mb-0">
              This platform is exclusively for AAU students with valid
              @aau.edu.et email addresses.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
