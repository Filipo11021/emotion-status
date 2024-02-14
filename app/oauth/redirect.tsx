import { Auth } from "@/shared/auth/core";
import { Navigate, useHandleSessionFromURL } from "@/shared/auth/expo";

export default function AuthRedirectPage() {
  const { isLoading, data: session, error } = useHandleSessionFromURL();

  return (
    <Auth
      type="protected"
      onSuccess={() => <Navigate href="/" type="replace" />}
      onForbidden={() => <Navigate href="/auth/" type="replace" />}
      customSessionState={{ isLoading, session }}
    />
  );
}
