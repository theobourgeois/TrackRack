"use client";

import {
  Alert,
  Button,
  Input,
  Typography,
} from "@/app/_components/mtw-wrappers";
import { color } from "@material-tailwind/react/types/components/alert";
import { BuiltInProviderType } from "next-auth/providers/index";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ProviderSigninButtonProps {
  icon?: React.ReactNode;
  provider: BuiltInProviderType;
  color?: color;
}
export function ProviderSigninButton({
  icon,
  provider,
  color,
}: ProviderSigninButtonProps) {
  return (
    <Button
      variant="outlined"
      className="flex items-center justify-center gap-2"
      color={color}
      onClick={() => signIn(provider)}
    >
      {icon} Sign in with {provider}
    </Button>
  );
}

export function SigninCredentials() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const router = useRouter();
  const handleSignIn = () => {
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        setLabel("User not found.");
      } else {
        router.push("/");
        setLabel("");
      }
    });
  };
  return (
    <>
      <form className="flex flex-col gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="password"
        />
        <Typography variant="small">Forgot your password?</Typography>
        <Button onClick={handleSignIn} color="indigo">
          Sign in
        </Button>
        {label && (
          <div className="flex h-12 items-center justify-center gap-1 rounded-lg bg-blue-gray-100/50 p-2 text-base">
            <FiAlertCircle />
            {label}
          </div>
        )}
      </form>
    </>
  );
}
