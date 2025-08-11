"use client";

import { useState } from "react";
import { ChartBarInteractive } from "./docs";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { Button } from "@heroui/button";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="py-10 flex justify-center">
        <Popover>
          <PopoverTrigger>
            <Button className="bg-my-primary text-white">Go to learning</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 ">
              <Link href="/learn">
                <div className="text-small font-bold dark:text-white">
                  Learning Feature
                </div>
                <div className="text-tiny dark:text-white">
                  This is the learning feature of our platform where you can
                  learn by yourself.
                </div>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <h1>CICD JOB</h1>
      <div>
        <h1>From Shadcn</h1>
        <h2>usage: npx shadcn@latest add chart</h2>
        <ChartBarInteractive />
      </div>
      <div>
        <h1>API USAGE with react-query</h1>
        <h1>CICD with cache successfully</h1>
      </div>
    </div>
  );
}
