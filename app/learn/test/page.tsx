"use client";

import { addToast, Button } from "@heroui/react";

export default function TestToast() {
  return (
    <Button
      onPress={() =>
        addToast({
          title: "Hello!",
          description: "This is a test toast",
          color: "primary",
        })
      }
    >
      Show Toast
    </Button>
  );
}
