
"use client";

import { z } from "zod";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const verifyCodeSchema = z.object({
  code: z.string().trim().min(1, "Verification code is required"),
});

type VerifyFormValues = z.infer<typeof verifyCodeSchema>;

type VerifyFormProps = {
  username: string;
};

export default function VerifyForm({ username }: VerifyFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleForm = async (data: VerifyFormValues) => {
    try {
      const payload = {
        ...data,
        username,
      };

      const response = await axios.post("/api/verify-code", payload);

      toast.success(
        response.data.message || "Your account has been verified!"
      );
      router.push("/sign-in")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Verification failed. Try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      console.error("Verification error:", error);
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
        py: 4,
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
          {/* Icon */}
          <Box
            sx={{
              width: 68,
              height: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "22px",
              color: "#fff",
              background: "linear-gradient(135deg, #8069ef, #5940d2)",
              boxShadow: "0 10px 24px rgba(98, 72, 215, 0.25)",
            }}
          >
            <VerifiedUserOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          {/* Heading */}
          <Stack spacing={1} alignItems="center">
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.65rem", sm: "2rem" },
                fontWeight: 800,
                color: "#211b3b",
                textAlign: "center",
                letterSpacing: "-0.7px",
              }}
            >
              Verify your account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ lineHeight: 1.8 }}
            >
              Enter the verification code sent to you to
              complete your registration.
            </Typography>
          </Stack>

          {/* Username */}
          <Box
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: "12px",
              backgroundColor: "#f5f3ff",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Verifying account
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: "#6248d8", overflowWrap: "anywhere" }}
            >
              {username}
            </Typography>
          </Box>

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
              label="Verification code"
              placeholder="Enter your code"
              autoComplete="one-time-code"
              error={!!errors.code}
              helperText={errors.code?.message || " "}
              {...register("code")}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityOutlinedIcon sx={{ color: "#928ba9" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#6c55dc",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#6c55dc",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
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
              {isSubmitting ? "Verifying..." : "Verify account"}
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{ lineHeight: 1.7 }}
          >
            <SecurityOutlinedIcon
              sx={{
                fontSize: 15,
                verticalAlign: "middle",
                mr: 0.5,
              }}
            />
            Your verification code helps keep your account secure.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
