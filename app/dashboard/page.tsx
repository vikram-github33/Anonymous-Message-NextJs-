"use client";
import React from "react";
import MessageCarosuel from "./MessageCarosuel";
import messages from "@/app/messages.json";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
const page = () => {
  const { data: session } = useSession();
  console.log("session", session);
  const router = useRouter();
  const handleRoute = () => {
    router.push(`/send-message/${session?.user.username}`);
  };
  return (
    <div>
      dashboard
      <MessageCarosuel messages={messages} />
      <Button variant="contained" onClick={handleRoute}>
        Send Message
      </Button>
    </div>
  );
};

export default page;
