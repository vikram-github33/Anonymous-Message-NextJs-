
"use client";

import { useState } from "react";
import { signInSchema } from "@/app/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Divider,
  Link,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { toast } from "react-toastify";

type SignInFormValues = {
  indentifier: string;
  password: string;
};

const defaultValues: SignInFormValues = {
  indentifier: "",
  password: "",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e4e2ee",
    },
    "&:hover fieldset": {
      borderColor: "#a69ae8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6c55dc",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#6c55dc",
  },
};

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });

  const handleForm = async (data: {
  indentifier: string;
  password: string;
}) => {
  const result = await signIn("credentials", {
    identifier: data.indentifier,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    toast.error("Sign-in failed. Check your credentials.");
  } else if (result?.ok) {
    toast.success("Login successful!");
    window.location.href = "/dashboard";
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        background:
          "radial-gradient(circle at 10% 10%, #e9e5ff 0%, transparent 35%), radial-gradient(circle at 90% 90%, #e3efff 0%, transparent 35%), #f8f8fc",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: "24px",
          border: "1px solid #eeebf6",
          boxShadow: "0 24px 70px rgba(46, 35, 96, 0.09)",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Header */}
          <Box
            sx={{
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              color: "#fff",
              background: "linear-gradient(135deg, #8069ef, #5940d2)",
              boxShadow: "0 8px 22px rgba(98, 72, 215, 0.25)",
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 34 }} />
          </Box>

          <Stack spacing={1} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.7rem", sm: "2rem" },
                fontWeight: 800,
                color: "#211b3b",
                letterSpacing: "-0.8px",
                textAlign: "center",
              }}
            >
              Welcome back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Sign in to continue to your account.
            </Typography>
          </Stack>

          {/* Form */}
          <Stack
            component="form"
            onSubmit={handleSubmit(handleForm)}
            spacing={2.5}
            sx={{ width: "100%" }}
            noValidate
          >
            <TextField
              fullWidth
              label="Username or email"
              placeholder="Enter your username or email"
              type="text"
              autoComplete="username"
              {...register("indentifier")}
              error={!!errors.indentifier}
              helperText={errors.indentifier?.message?.toString() || " "}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: "#928ba9" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />

            <TextField
              fullWidth
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message?.toString() || " "}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#928ba9" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((previous) => !previous)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={fieldSx}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  color: "#634bd5",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.6,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #8069ef, #5940d2)",
                boxShadow: "0 8px 20px rgba(98, 72, 215, 0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #7058e0, #4931bf)",
                  boxShadow: "0 10px 24px rgba(98, 72, 215, 0.3)",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>

          <Divider sx={{ width: "100%", borderColor: "#eeebf5" }} />

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              underline="hover"
              sx={{ color: "#634bd5", fontWeight: 700 }}
            >
              Create account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
