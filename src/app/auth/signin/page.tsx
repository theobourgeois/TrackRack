import { ServerForm } from "@/app/_components/form";
import { Button, Input, Typography } from "@/app/_components/mtw-wrappers";
import { color } from "@material-tailwind/react/types/components/alert";
import { BuiltInProviderType } from "next-auth/providers/index";
import { getProviders, signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";
import {
  ProviderSigninButton,
  SigninCredentials,
} from "../_components/signin-button";
import { FcGoogle } from "react-icons/fc";

type ProviderData = {
  [key in BuiltInProviderType]?: {
    icon: React.ReactNode;
    color: color;
  };
};

export const providerData: ProviderData = {
  discord: {
    icon: <FaDiscord size="20" />,
    color: "indigo",
  },
  google: {
    icon: <FcGoogle size="20" />,
    color: "red",
  },
};

export default async function Login() {
  const providers = (await getProviders()) ?? [];
  return (
    <div className="flex h-screen w-screen items-center justify-center drop-shadow-sm">
      <div className="flex flex-col gap-4 rounded-lg bg-blue-gray-50/50 p-8">
        <Typography variant="h2">
          Sign in to Track<span className="text-indigo-500">Rack</span>
        </Typography>
        <SigninCredentials />
        <Typography variant="h5" className="text-center">
          OR
        </Typography>
        <div className="flex flex-col gap-2">
          {(Object.keys(providers) as BuiltInProviderType[]).map(
            (provider) =>
              provider !== "credentials" && (
                <ProviderSigninButton
                  key={provider}
                  {...providerData[provider]}
                  provider={provider}
                />
              ),
          )}
        </div>
      </div>
    </div>
  );
}
