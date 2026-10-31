
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const formValidation = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message cannot exceed 1000 characters"),
});

type FormData = z.infer<typeof formValidation>;

interface Props {
  username: string;
}

const SendMessageForm = ({ username }: Props) => {
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSuccess("");
    setApiError("");

    try {
      const response = await axios.post("/api/send-messages", {
        content: data.content,
        username,
      });

      console.log("Message sent:", response.data);

      setSuccess("Message sent successfully!");

      reset();
    } catch (error) {
      console.error("Failed to send message:", error);

      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message ||
            "Failed to send message. Please try again."
        );
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
      sx={{
        width: "100%",
        maxWidth: 500,
        mx: "auto",
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <TextField
        label="Recipient"
        value={username}
        fullWidth
        disabled
      />

      {success && <Alert severity="success">{success}</Alert>}

      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Controller
        name="content"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Your Message"
            placeholder="Write your message here..."
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </Box>
  );
};

export default SendMessageForm;
