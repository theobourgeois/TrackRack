"use client";
import { Button, Input, Typography } from "@/app/_components/mtw-wrappers";
import { color } from "@material-tailwind/react/types/components/alert";
import { BuiltInProviderType } from "next-auth/providers/index";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
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
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [label, setLabel] = useState("");
  const router = useRouter();
  const submitDisabled = !email || !password;

  useEffect(() => {
    setLabel("");
  }, [email, password]);

  const handleSignIn = () => {
    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        setLabel("Invalid email or password");
      } else {
        const invite = searchParams.get("invite");
        if (invite) {
          router.push(`/project-invite/${invite}?accept=true`);
          return;
        }
        router.push("/");
        setLabel("");
      }
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
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
          type={showPassword ? "text" : "password"}
          label="password"
          icon={
            <FaEye
              className="cursor-pointer hover:text-indigo-500"
              onClick={toggleShowPassword}
            />
          }
        />
        <Typography variant="small">Forgot your password?</Typography>
        <Button disabled={submitDisabled} onClick={handleSignIn} color="indigo">
          Sign in
        </Button>
        {label && (
          <div className="flex h-10 items-center justify-center gap-1 rounded-lg bg-red-300 p-2  text-sm text-white">
            <FiAlertCircle />
            {label}
          </div>
        )}
      </form>
    </>
  );
}
