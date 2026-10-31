"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Snackbar,
} from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { MessageRounded, AccessTimeRounded, Try } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
const switchValidation = z.object({
  isAcceptingMessages: z.boolean(),
});
export default function MessageCarousel({ messages }: any) {
  const { data: session,status } = useSession();
  const router = useRouter()
    console.log("session", session);
  const {
    control,
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof switchValidation>>({
    resolver: zodResolver(switchValidation),
    defaultValues: {
      isAcceptingMessages: session?.user?.isAcceptingMessages ??false,
    },
  });
   const [copied, setCopied] = useState(false);
//   const isAcceptingMessage = watch("isAcceptingMessages");
  const handleSwitch = async (checked: boolean) => {
     const previousValue = getValues("isAcceptingMessages");

  setValue("isAcceptingMessages", checked);
    try {
      //   console.log(value);
      //   const isAcctMessage = !value;
      const res = await axios.post("/api/accept-messages", {
        isAcceptingMessage: checked,
      });
      if (res.data) {
        setValue(
          "isAcceptingMessages",
          res.data.updatedUser.isAcceptingMessage,
        );
      }
      console.log(res);
    } catch (error) {
       console.error("Failed to update message settings:", error);

    setValue("isAcceptingMessages", previousValue);
    }
  };
  const username = session?.user?.username;

const messageUrl =
  typeof window !== "undefined" && username
    ? `${window.location.origin}/send-message/${username}`
    : "";
   const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${messageUrl}`);
      setCopied(true);
      router.push(`/send-message/${session?.user.username}`);
    } catch (error) {
      console.error("Failed to copy username:", error);
    }
  };
  useEffect(() => {
  if (status === "authenticated") {
    setValue(
      "isAcceptingMessages",
      session.user.isAcceptingMessages
    );
  }
}, [session, status, setValue]);
  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        pt: 5,
        px: 2,
      }}
    >
      {/* Switch at Top */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
        sx={{ mb: 2 }}
      >
        {/* <Typography variant="body2">Recieve</Typography> */}
     <TextField
  label="Your anonymous message link"
  value={messageUrl}
  fullWidth
  size="small"
  slotProps={{
    input: {
      readOnly: true,
      endAdornment: (
        <InputAdornment position="end">
          <Tooltip title={copied ? "Copied!" : "Copy link"}>
            <IconButton
              onClick={handleCopy}
              edge="end"
              size="small"
              color="primary"
              disabled={!messageUrl}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      ),
    },
  }}
/>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        message="Username copied successfully!"
        onClose={() => setCopied(false)}
      />
        <Controller
          name="isAcceptingMessages"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Recieve Message Or not"
              control={
                <Switch
                  checked={field.value}
                  onChange={(_, checked) => handleSwitch(checked)}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              }
            />
          )}
        />
      </Stack>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={messages.length > 1}
        spaceBetween={16}
        slidesPerView={1}
      >
        {messages.map((message: any, index: any) => (
          <SwiperSlide key={message._id ?? index}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                height: "100%",
                bgcolor: "background.paper",
                transition: "transform 0.3s ease",

                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "inherit",
                    }}
                  >
                    <MessageRounded />
                  </Avatar>

                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Anonymous Message
                    </Typography>

                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Someone sent you a message
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />

                  <Chip
                    label="Anonymous"
                    size="small"
                    sx={{
                      color: "inherit",
                      bgcolor: "rgba(255,255,255,0.15)",
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Box>

              {/* Message Content */}
              <CardContent
                sx={{
                  px: 3,
                  py: 3,
                  minHeight: 180,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.title}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.content}
                </Typography>
              </CardContent>

              {/* Footer */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: 1,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTimeRounded fontSize="small" color="action" />

                  <Typography variant="caption" color="text.secondary">
                    Received: {message.received}
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
