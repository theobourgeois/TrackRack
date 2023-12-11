"use client";
import { Button, Input, Typography } from "@/app/_components/mtw-wrappers";
import { api } from "@/trpc/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa";

export function SignupCredentials() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitDisabled = !email || !password || !name;
  const router = useRouter();
  const searchParams = useSearchParams();

  const createUser = api.users.create.useMutation({
    onSuccess: (data) => {
      signIn("credentials", {
        email: data.email,
        password: password,
        redirect: false,
      }).then((res) => {
        if (!res?.error) {
          const invite = searchParams.get("invite");
          if (invite) {
            router.push(`/project-invite/${invite}`);
          } else {
            router.push("/");
          }
        }
      });
    },
    onError: (e) => {
      console.error("Error creating user:", e);
    },
  });

  const handleSignIn = async () => {
    createUser.mutate({
      email,
      password,
      name,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <form className="flex flex-col gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="username"
          type="text"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="email"
          type="email"
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
        <Button
          disabled={isSubmitDisabled}
          onClick={handleSignIn}
          color="indigo"
        >
          Create account
        </Button>
      </form>
    </>
  );
}
