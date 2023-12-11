import { Typography } from "@/app/_components/mtw-wrappers";
import { BuiltInProviderType } from "next-auth/providers/index";
import { getProviders } from "next-auth/react";
import { ProviderSigninButton } from "../_components/signin-button";
import { providerData } from "../signin/page";
import { SignupCredentials } from "../_components/signup-button";

export default async function Home() {
  const providers = (await getProviders()) ?? [];
  return (
    <div className="flex h-screen w-screen items-center justify-center drop-shadow-sm">
      <div className="flex flex-col gap-4 rounded-lg bg-blue-gray-50/50 p-8">
        <Typography variant="h2">
          Welcome to Track<span className="text-indigo-500">Rack</span>
        </Typography>
        <SignupCredentials />
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
