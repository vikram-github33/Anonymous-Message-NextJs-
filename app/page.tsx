"use client";

import React from "react";
import MessageCarousel from "@/app/dashboard/MessageCarosuel";
import messages from "@/app/messages.json";
import { useSession } from "next-auth/react";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleRoute = () => {
    if (status !== "authenticated" || !session?.user?.username) {
      router.push("/sign-in");
      return;
    }

    router.push(`/send-message/${session.user.username}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard
      </Typography>

      <MessageCarousel messages={messages} />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleRoute}
          disabled={status === "loading"}
        >
          Send Message
        </Button>
      </Box>
    </Box>
  );
}