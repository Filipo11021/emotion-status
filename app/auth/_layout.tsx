import { Auth } from "@/shared/auth/core";
import { Navigate } from "@/shared/auth/expo";
import { Slot } from "expo-router";

export default function MainLayout() {
  return (
    <Auth
      onForbidden={() => <Navigate type="replace" href="/(tabs)/" />}
      type="unprotected"
    >
      <Slot />
    </Auth>
  );
}
