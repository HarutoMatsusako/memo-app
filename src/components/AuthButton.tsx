"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Sign out ({session.user?.name})
      </button>
    );
  }
  return <button onClick={() => signIn("google")}>Sign in with Google</button>;
}
