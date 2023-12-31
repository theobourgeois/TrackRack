import "@/styles/globals.css";
import { cookies } from "next/headers";
import { ThemeProvider } from "./_providers/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { SnackBarProvider } from "./_providers/snackbar-provider";
import { AudioPlayerProvider } from "./_providers/audio-player-provider";
import { Navbar } from "./_components/navbar";
import { SessionProvider } from "./_providers/session-provider";

export const metadata = {
  title: "TrackRack",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="flex-col overflow-hidden">
        <Navbar />
        <SessionProvider>
          <AudioPlayerProvider>
            <TRPCReactProvider cookies={cookies().toString()}>
              <SnackBarProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </SnackBarProvider>
            </TRPCReactProvider>
          </AudioPlayerProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
