"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  MessageRounded,
  AccessTimeRounded,
  ContentCopyRounded,
  SendRounded,
  CheckCircleRounded,
  PauseCircleRounded,
  ArrowForwardRounded,
  MarkEmailUnreadRounded,
} from "@mui/icons-material";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Message = {
  _id?: string;
  title: string;
  content: string;
  received: string;
};

type Props = {
  messages: Message[];
};

export default function MessageCarousel({ messages }: any) {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("message", messages);

  const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);

  const [switchLoading, setSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const username = session?.user?.username;

  const messageUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}/send-message/${username}`
      : "";

  // Initialize switch from authenticated session
  useEffect(() => {
    if (status === "authenticated") {
      setIsAcceptingMessages(session?.user?.isAcceptingMessages ?? false);
    }
  }, [session, status]);

  // Update message acceptance status
  const handleSwitch = async (checked: boolean) => {
    if (switchLoading) return;

    const previousValue = isAcceptingMessages;

    setIsAcceptingMessages(checked);
    setSwitchLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/accept-messages", {
        isAcceptingMessage: checked,
      });

      const updatedValue = response.data?.updatedUser?.isAcceptingMessage;

      if (typeof updatedValue === "boolean") {
        setIsAcceptingMessages(updatedValue);
      } else {
        setIsAcceptingMessages(checked);
      }
    } catch (error) {
      console.error("Failed to update message settings:", error);

      setIsAcceptingMessages(previousValue);

      setError("Unable to update message settings. Please try again.");
    } finally {
      setSwitchLoading(false);
    }
  };

  function message() {
    console.log("object");
  }
  // Copy anonymous message link
  const handleCopy = async () => {
    if (!messageUrl) return;

    try {
      await navigator.clipboard.writeText(messageUrl);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setError("Unable to copy the link. Please try again.");
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* Dashboard Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#0f172a",
                letterSpacing: "-0.8px",
              }}
            >
              Dashboard
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mt: 1,
              }}
            >
              Manage your anonymous messages and account settings.
            </Typography>
          </Box>

          <Chip
            icon={
              isAcceptingMessages ? (
                <CheckCircleRounded />
              ) : (
                <PauseCircleRounded />
              )
            }
            label={
              isAcceptingMessages ? "Messages enabled" : "Messages disabled"
            }
            color={isAcceptingMessages ? "success" : "default"}
            variant="outlined"
            sx={{
              fontWeight: 600,
              bgcolor: "#fff",
              px: 1,
              py: 2.5,
              borderRadius: 2,
            }}
          />
        </Stack>

        {/* Statistics */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    width: 48,
                    height: 48,
                  }}
                >
                  <MessageRounded />
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Messages
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ color: "#0f172a" }}
                  >
                    {messages?.length}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: isAcceptingMessages ? "#ecfdf5" : "#f1f5f9",
                    color: isAcceptingMessages ? "#059669" : "#64748b",
                    width: 48,
                    height: 48,
                  }}
                >
                  {isAcceptingMessages ? (
                    <CheckCircleRounded />
                  ) : (
                    <PauseCircleRounded />
                  )}
                </Avatar>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Message Status
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#0f172a" }}
                  >
                    {isAcceptingMessages
                      ? "Accepting messages"
                      : "Not accepting"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Message Settings */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            mb: 3,
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2.5, md: 3 },
              "&:last-child": {
                pb: { xs: 2.5, md: 3 },
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ color: "#0f172a" }}
                >
                  Message Settings
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Control whether people can send you anonymous messages.
                </Typography>
              </Box>

              <FormControlLabel
                sx={{
                  m: 0,
                  "& .MuiFormControlLabel-label": {
                    fontSize: 14,
                    fontWeight: 600,
                  },
                }}
                label={
                  switchLoading
                    ? "Updating..."
                    : isAcceptingMessages
                      ? "Enabled"
                      : "Disabled"
                }
                control={
                  <Switch
                    checked={isAcceptingMessages}
                    disabled={switchLoading}
                    onChange={(_, checked) => handleSwitch(checked)}
                    color="success"
                  />
                }
              />
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your personal link to receive anonymous messages.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                value={messageUrl}
                fullWidth
                size="small"
                placeholder="Your anonymous message link"
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SendRounded
                          fontSize="small"
                          sx={{ color: "#64748b" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleCopy}
                disabled={!messageUrl}
                startIcon={<ContentCopyRounded />}
                sx={{
                  minWidth: 130,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Copy Link
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Messages Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a" }}>
              Your Messages
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Anonymous messages received from your visitors.
            </Typography>
          </Box>

          <Chip
            label={`${messages.length} messages`}
            size="small"
            sx={{
              bgcolor: "#eff6ff",
              color: "#2563eb",
              fontWeight: 700,
            }}
          />
        </Stack>

        {/* Empty State */}
        {messages.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed #cbd5e1",
              borderRadius: 3,
              textAlign: "center",
              py: 7,
              px: 3,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                bgcolor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <MarkEmailUnreadRounded fontSize="large" />
            </Avatar>

            <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a" }}>
              No messages yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 350,
                mx: "auto",
                mt: 1,
                mb: 3,
              }}
            >
              Share your anonymous message link with friends and start receiving
              messages.
            </Typography>

            <Button
              variant="contained"
              onClick={handleCopy}
              disabled={!messageUrl}
              startIcon={<ContentCopyRounded />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Share Your Link
            </Button>
          </Card>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={messages.length > 1}
            spaceBetween={20}
            slidesPerView={1}
            style={{
              paddingBottom: 45,
            }}
          >
            {messages.map((message: any, index: any) => (
              <SwiperSlide key={message._id ?? index}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    minHeight: 300,
                    transition: "box-shadow 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                    },
                  }}
                >
                  {/* Card Header */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2.5,
                      bgcolor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#2563eb",
                        }}
                      >
                        <MessageRounded />
                      </Avatar>

                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          sx={{ color: "#0f172a" }}
                        >
                          Anonymous Message
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Message #{index + 1}
                        </Typography>
                      </Box>

                      <Box sx={{ flexGrow: 1 }} />

                      <Chip
                        label="Anonymous"
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Message Content */}
                  <CardContent
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      minHeight: 170,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        color: "#0f172a",
                        mb: 1.5,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.title || "Anonymous Message"}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#475569",
                        lineHeight: 1.9,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.content}
                      {console.log("object====,", message)}
                    </Typography>
                  </CardContent>

                  {/* Card Footer */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeRounded
                        sx={{
                          fontSize: 17,
                          color: "#94a3b8",
                        }}
                      />

                      <Typography variant="caption" color="text.secondary">
                        Received:{" "}
                        {new Date(message.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Notifications */}
        <Snackbar
          open={copied}
          autoHideDuration={2500}
          onClose={() => setCopied(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setCopied(false)}
          >
            Anonymous message link copied!
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={4000}
          onClose={() => setError("")}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert severity="error" variant="filled" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
