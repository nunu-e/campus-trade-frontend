import { Container } from "react-bootstrap";

const PrivacyPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong> June 2, 2025
      </p>

      <h4>Information We Collect</h4>
      <p>
        When you register, we collect your name, AAU email address, student ID,
        department, and optionally your phone number. When you create listings,
        we store the title, description, price, images, and location.
      </p>

      <h4>How We Use Your Information</h4>
      <ul>
        <li>To verify your AAU student status.</li>
        <li>To facilitate communication between buyers and sellers.</li>
        <li>To improve our platform and prevent fraud.</li>
        <li>
          To send you important notifications (e.g., OTP, password reset).
        </li>
      </ul>

      <h4>Data Sharing</h4>
      <p>
        We do not sell or rent your personal data. We may share information
        with:
      </p>
      <ul>
        <li>
          <strong>Other users</strong> – only what you choose to display (name,
          department, rating).
        </li>
        <li>
          <strong>Service providers</strong> – email delivery (Brevo), hosting
          (Render), database (MongoDB Atlas).
        </li>
        <li>
          <strong>Legal authorities</strong> – if required by law.
        </li>
      </ul>

      <h4>Data Security</h4>
      <p>
        Passwords are hashed using bcrypt. Your email and student ID are stored
        encrypted at rest. We use HTTPS and follow security best practices.
      </p>

      <h4>Your Rights</h4>
      <p>
        You can view, edit, or delete your personal information from your
        profile. To permanently delete your account, contact support.
      </p>

      <h4>Cookies</h4>
      <p>
        We use only essential cookies (session tokens). No tracking or analytics
        cookies are used.
      </p>

      <h4>Children’s Privacy</h4>
      <p>
        Our platform is not intended for users under 18. We do not knowingly
        collect data from minors.
      </p>

      <h4>Changes to This Policy</h4>
      <p>
        We will notify users of any material changes via email or a site notice.
      </p>

      <h4>Contact</h4>
      <p>
        Privacy questions? Email{" "}
        <a href="mailto:ambachewelbethel7@gmail.com">
          ambachewelbethel7@gmail.com
        </a>
        .
      </p>
    </Container>
  );
};

export default PrivacyPage;
