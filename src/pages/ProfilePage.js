import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Profile from "../components/Profile/Profile";

const ProfilePage = () => {
  useEffect(() => {
    // Check if user was redirected here due to verification requirement
    const verificationRequired = sessionStorage.getItem('verification_required');
    if (verificationRequired === 'true') {
      toast.warning("Please verify your email to create listings and access all features");
      sessionStorage.removeItem('verification_required');
    }
  }, []);

  return (
    <Container fluid="lg" className="py-4">
      <Profile />
    </Container>
  );
};

export default ProfilePage;
