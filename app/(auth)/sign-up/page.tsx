
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/app/schemas/signUpSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type SignUpForm = {
  username: string;
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const trimmedUsername = userName.trim();

    if (!trimmedUsername) {
      setUsernameMessage("");
      setUsernameAvailable(false);
      setCheckingUsername(false);
      return;
    }

    setUsernameMessage("");
    setUsernameAvailable(false);
    setCheckingUsername(true);

    let active = true;

    const timeout = setTimeout(async () => {
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${encodeURIComponent(
            trimmedUsername
          )}`
        );

        if (!active) return;

        setUsernameAvailable(Boolean(response.data.success));
        setUsernameMessage(
          response.data.message ||
            (response.data.success
              ? "Username is available"
              : "Username is already taken")
        );
      } catch (error) {
        if (!active) return;

        setUsernameAvailable(false);
        setUsernameMessage("Unable to check username");
        console.error("Username check failed:", error);
      } finally {
        if (active) setCheckingUsername(false);
      }
    }, 700);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [userName]);

  const handleForm = async (data: SignUpForm) => {
    if (!usernameAvailable) {
      toast.error("Please enter an available username.");
      return;
    }

    try {
      const response = await axios.post("/api/sign-up", data);

      toast.success(response.data.message || "Account created successfully!");

      router.push(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Unable to create your account."
      );
      console.error("Signup failed:", error);
    }
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
          "radial-gradient(circle at 10% 10%, #e8e5ff 0%, transparent 35%), radial-gradient(circle at 90% 90%, #e6efff 0%, transparent 35%), #f8f8fc",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: "24px",
          border: "1px solid #eeebf6",
          boxShadow: "0 24px 70px rgba(46, 35, 96, 0.09)",
        }}
      >
        {/* Header */}
        <Stack spacing={1} sx={{ mb: 4, alignItems: "center" }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              background: "linear-gradient(135deg, #8a75f5, #5b43d6)",
              boxShadow: "0 8px 22px rgba(100, 77, 215, 0.25)",
              mb: 1,
            }}
          >
            {/* <PersonOutlineIcon sx={{ fontSize: 32 }} /> */}
          </Box>

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
            Create your account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Get started — it only takes a minute.
          </Typography>
        </Stack>

        {/* Form */}
        <Stack
          component="form"
          onSubmit={handleSubmit(handleForm)}
          spacing={2.5}
          noValidate
        >
          <TextField
            fullWidth
            label="Username"
            placeholder="Choose a username"
            autoComplete="username"
            {...register("username")}
            value={userName}
            onChange={(event) => {
              const value = event.target.value;

              setUserName(value);
              setValue("username", value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            error={!!errors.username}
            helperText={
              errors.username?.message ? (
                String(errors.username.message)
              ) : usernameMessage ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: usernameAvailable ? "#16803d" : "#d32f2f",
                  }}
                >
                  {usernameAvailable && (
                    <CheckCircleOutlineIcon sx={{ fontSize: 15 }} />
                  )}
                  {checkingUsername
                    ? "Checking username..."
                    : usernameMessage}
                </Box>
              ) : checkingUsername ? (
                "Checking username..."
              ) : (
                " "
              )
            }
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
            label="Email address"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message?.toString() || " "}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#928ba9" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="Password"
            placeholder="Create a strong password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 1,
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </Stack>

        <Divider sx={{ my: 3, borderColor: "#eeebf5" }} />

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
        >
          Already have an account?{" "}
          <Link
            href="/sign-in"
            underline="hover"
            sx={{ color: "#634bd5", fontWeight: 700 }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
