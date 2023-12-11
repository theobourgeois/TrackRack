import React from "react";
import {
  Body,
  Html,
  Container,
  Tailwind,
  Text,
  Button,
  Head,
  Heading,
  Link,
} from "@react-email/components";

export default function ProjectInviteEmail({
  projectName = "ProjectName",
  magicLink = "https://example.com",
  senderName = "User Name",
}: {
  projectName: string;
  magicLink: string;
  senderName: string;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-12 bg-white font-sans">
          <Container className="rounded-lg px-8 pt-8 shadow-lg">
            <Heading className="my-0 text-2xl">
              {senderName}{" "}
              <span className="font-normal">invited you to join </span>{" "}
              {projectName}
            </Heading>
            <Text className="mt-2 text-lg">
              Would you like to accept this invitation?
            </Text>
            <Container className="flex items-center ">
              <Link
                href={magicLink + "?accept=false"}
                className="mr-2 cursor-pointer select-none rounded-md bg-red-400 px-4 py-2 text-white hover:bg-red-500"
              >
                Decline
              </Link>
              <Link
                href={magicLink + "?accept=true"}
                className="cursor-pointer select-none rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600"
              >
                Accept
              </Link>
            </Container>
            <Container className="mt-2 flex items-center justify-end">
              <Text className="text-2xl font-semibold">
                Track
                <span className="text-indigo-500">Rack</span>
              </Text>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
