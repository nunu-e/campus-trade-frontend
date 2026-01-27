import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    department: "",
    studentID: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Economics",
    "Law",
    "Medicine",
    "Pharmacy",
    "Other",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one letter and one number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.studentID.trim())
      newErrors.studentID = "Student ID is required";

    if (
      formData.phoneNumber &&
      !/^(\+251|0)[79]\d{8}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid Ethiopian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber || "",
      department: formData.department,
      studentID: formData.studentID,
    };

    try {
      const result = await register(registrationData);

      if (result.success) {
        // Show success message with email info
        const message = result.message || "Registration successful! Please check your email for verification.";
        
        // In development mode, show the verification link if available
        if (result.data?.verificationLink) {
          alert(
            `${message}\n\nDevelopment Mode - Verification Link:\n${result.data.verificationLink}`
          );
        } else {
          alert(message);
        }
        
        navigate("/login");
      } else {
        setApiError(result.error || "Registration failed");
      }
    } catch (error) {
      setApiError("An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Create CampusTrade Account</h4>
              <small className="text-light">
                Join our student marketplace community
              </small>
            </Card.Header>
            <Card.Body>
              {apiError && <Alert variant="danger">{apiError}</Alert>}

              <Alert variant="info">
                <strong>Important:</strong> A verification link will be sent to
                your email. You must verify your email before you can login.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter your full name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    placeholder="your.email@example.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    We'll send a verification link to this email
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    placeholder="Minimum 6 characters with letters and numbers"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Re-enter your password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number (Optional)</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.phoneNumber}
                    placeholder="+2519XXXXXXXX or 09XXXXXXXX"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    For buyer/seller communication
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department *</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    isInvalid={!!errors.department}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Student ID *</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentID"
                    value={formData.studentID}
                    onChange={handleChange}
                    isInvalid={!!errors.studentID}
                    placeholder="e.g., UGR/1234/16"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.studentID}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none">
                      Login here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Register;
