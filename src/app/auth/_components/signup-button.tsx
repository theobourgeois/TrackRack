"use client";
import { Button, Input, Typography } from "@/app/_components/mtw-wrappers";
import { useSnackBar } from "@/app/_providers/snackbar-provider";
import { EMAIL_REGEX } from "@/utils/validation";
import { api } from "@/trpc/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import _ from "lodash";

export function SignupCredentials() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [label, setLabel] = useState("");
  const isSubmitDisabled =
    !email ||
    !password ||
    !name ||
    Object.values(errors).filter((value) => value).length > 0;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessNotification } = useSnackBar();

  const createUser = api.users.create.useMutation({
    onSuccess: (data) => {
      signIn("credentials", {
        email: data.email,
        password: password,
        redirect: false,
      }).then((res) => {
        if (!res?.error) {
          const invite = searchParams.get("invite");
          showSuccessNotification(
            "Account created successfully, you will be redirected soon.",
          );
          if (invite) {
            router.push(`/project-invite/${invite}`);
          } else {
            router.push("/");
          }
        }
      });
    },
    onError: (e) => {
      setLabel(e.message);
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

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
    switch (true) {
      case !RegExp(EMAIL_REGEX).test(email):
        setErrors((prev) => ({ ...prev, email: "Invalid email" }));
        break;
      default:
        setErrors((prev) => ({ ...prev, email: undefined }));
        break;
    }
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
    switch (true) {
      case password.length < 8:
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 8 characters",
        }));
        break;
      default:
        setErrors((prev) => ({ ...prev, password: undefined }));
        break;
    }
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
        <div>
          <Input
            value={email}
            onChange={handleChangeEmail}
            label="email"
            type="email"
            error={Boolean(errors.email)}
          />
          {errors.email && (
            <Typography variant="small" color="red">
              {errors.email}
            </Typography>
          )}
        </div>
        <div>
          <Input
            value={password}
            onChange={handleChangePassword}
            type={showPassword ? "text" : "password"}
            label="password"
            error={Boolean(errors.password)}
            icon={
              <FaEye
                className="cursor-pointer hover:text-indigo-500"
                onClick={toggleShowPassword}
              />
            }
          />
          {errors.password && (
            <Typography variant="small" color="red">
              {errors.password}
            </Typography>
          )}
        </div>
        <Typography variant="small">Forgot your password?</Typography>
        <Button
          disabled={isSubmitDisabled}
          onClick={handleSignIn}
          color="indigo"
        >
          Create account
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
