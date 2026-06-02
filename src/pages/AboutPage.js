import { Col, Container, Row } from "react-bootstrap";

const AboutPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">About CampusTrade</h1>
      <Row>
        <Col md={8}>
          <p className="lead">
            CampusTrade is the first student‑to‑student marketplace built
            exclusively for Addis Ababa University students.
          </p>
          <p>
            We understand the challenges students face – expensive textbooks,
            unused dorm essentials, and the need for affordable services. Our
            platform connects buyers and sellers within the AAU community,
            making transactions safe, convenient, and tailored to campus life.
          </p>
          <h4 className="mt-4">Our Mission</h4>
          <p>
            To empower AAU students by providing a trusted, easy‑to‑use platform
            where they can buy, sell, and rent items and services, reducing
            waste and saving money.
          </p>
          <h4>Why CampusTrade?</h4>
          <ul>
            <li>
              <strong>Verified Student Emails</strong> – Only AAU students can
              join (using @aau.edu.et).
            </li>
            <li>
              <strong>Secure Transactions</strong> – In‑app messaging and
              reserved listings protect both parties.
            </li>
            <li>
              <strong>Zero Commission</strong> – We don’t charge any fees. It’s
              free for students.
            </li>
            <li>
              <strong>Local Campus Focus</strong> – Meet on campus for safe
              exchanges.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
