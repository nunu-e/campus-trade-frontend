import { Accordion, Container } from "react-bootstrap";

const FAQPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Frequently Asked Questions</h1>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Who can use CampusTrade?</Accordion.Header>
          <Accordion.Body>
            Currently enrolled Addis Ababa University students
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Is CampusTrade free?</Accordion.Header>
          <Accordion.Body>
            Yes! CampusTrade is completely free for all AAU students. We do not
            charge listing fees or commissions.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I verify my email?</Accordion.Header>
          <Accordion.Body>
            After registration, you will receive a 6‑digit OTP code via email.
            Enter it on the verification page to activate your account.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>What can I sell on CampusTrade?</Accordion.Header>
          <Accordion.Body>
            You can sell textbooks, electronics, furniture, clothing, and other
            student essentials. You can also rent items (e.g., calculators,
            tools) or offer services like tutoring and design.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>How do I contact a seller?</Accordion.Header>
          <Accordion.Body>
            Click the "Message" button on any listing. You will be able to chat
            directly with the seller through our secure messaging system.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>What if I receive a damaged item?</Accordion.Header>
          <Accordion.Body>
            Always inspect items before paying. Our platform facilitates
            communication but does not handle payments. We encourage meeting on
            campus and checking the item thoroughly.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>
            How do I report a suspicious user?
          </Accordion.Header>
          <Accordion.Body>
            Use the "Report" button on the user’s profile or the listing page.
            Our admin team will review and take appropriate action.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Can I delete my account?</Accordion.Header>
          <Accordion.Body>
            Yes. Go to your profile settings and click "Delete Account". This
            action is permanent and will remove all your listings and messages.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default FAQPage;
