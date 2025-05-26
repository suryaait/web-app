import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import axios from "axios";
import { login, register } from "../../apis/loginApi";
import { useNavigate } from "react-router";

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

const LoginRegister: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("token", response.data.access_token);
      setSuccess("Login successful!");
      setFormData({ name: "", email: "", password: "" });
      navigate("/products");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await register(formData.name ?? "", formData.email, formData.password);
      setSuccess("Registration successful! You can now log in.");
      setFormData({ name: "", email: "", password: "" });
      setIsRegisterMode(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {isRegisterMode ? "Register" : "Login"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!isRegisterMode ? (
          <>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Not registered?{" "}
              <Link href="#" onClick={() => setIsRegisterMode(true)}>
                Register us
              </Link>
            </Typography>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister}>
              <TextField
                label="Name"
                name="name"
                type="text"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </form>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Already registered?{" "}
              <Link href="#" onClick={() => setIsRegisterMode(false)}>
                Back to Login
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginRegister;
