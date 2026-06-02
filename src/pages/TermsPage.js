import { Container } from "react-bootstrap";

const TermsPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Terms of Service</h1>
      <p>
        <strong>Last updated:</strong> June 2, 2025
      </p>

      <h4>1. Acceptance of Terms</h4>
      <p>
        By registering for CampusTrade (“the Platform”), you agree to these
        Terms of Service. If you do not agree, please do not use the Platform.
      </p>

      <h4>2. Eligibility</h4>
      <p>
        You must be a currently enrolled student of Addis Ababa University with
        a valid <code>@aau.edu.et</code> email address to create an account.
      </p>

      <h4>3. User Conduct</h4>
      <p>You agree not to:</p>
      <ul>
        <li>
          List prohibited items (illegal goods, weapons, drugs, stolen
          property).
        </li>
        <li>Harass, threaten, or deceive other users.</li>
        <li>Post false or misleading information.</li>
        <li>
          Use the Platform for any commercial purpose outside of
          student‑to‑student exchange.
        </li>
      </ul>

      <h4>4. Listings and Transactions</h4>
      <p>
        All listings are created by users. CampusTrade does not verify the
        accuracy of listings. Transactions are solely between buyer and seller.
        We recommend meeting on campus, inspecting items, and using safe payment
        methods (e.g., cash on delivery).
      </p>

      <h4>5. Account Suspension</h4>
      <p>
        We reserve the right to suspend or terminate any account that violates
        these terms or engages in fraudulent activity.
      </p>

      <h4>6. Privacy</h4>
      <p>
        Your use of the Platform is also governed by our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h4>7. Limitation of Liability</h4>
      <p>
        CampusTrade is not responsible for any disputes, losses, or damages
        arising from transactions between users. We provide a platform for
        communication and listing management only.
      </p>

      <h4>8. Changes to Terms</h4>
      <p>
        We may update these Terms from time to time. Continued use of the
        Platform after changes constitutes acceptance.
      </p>

      <h4>9. Contact Us</h4>
      <p>
        If you have any questions, email us at{" "}
        <a href="mailto:ambachewelbethel7@gmail.com">
          ambachewelbethel7@gmail.com
        </a>
        .
      </p>
    </Container>
  );
};

export default TermsPage;
