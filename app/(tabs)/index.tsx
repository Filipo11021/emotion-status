import { MyStatuses } from "@/features/my-statuses/my-statuses";
import { Link } from "expo-router";
import { Button, View } from "react-native-ui-lib";

export default function YourEmotionsView() {
  return (
    <View padding-8>
      <Link asChild href="/create-status-modal">
        <Button padding-4 label="Emote your emotion" />
      </Link>
      <MyStatuses />
    </View>
  );
}
