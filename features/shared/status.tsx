import { Database } from "@/shared/database-types";
import { Card, Image, Text, View } from "react-native-ui-lib";
import { emotionsData, reasonsData } from "./icons-data";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function Status({
  status,
  displayName,
}: {
  status: Database["public"]["Tables"]["statuses"]["Row"] & {
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  };
  displayName: string;
}) {
  const emotion = emotionsData.find(({ label }) => label === status.emotion);
  const reason = reasonsData.find(({ label }) => label === status.reason);

  return (
    <Card padding-10 gap-8>
      <View row centerV gap-8>
        <Text style={{ padding: "auto" }}>{displayName} feeling</Text>
        <Image width={40} height={40} source={emotion?.image} />
        <Text>because</Text>
        <Image width={40} height={40} source={reason?.image} />
      </View>
      <View row gap-4 spread>
        <Text>{status.note}</Text>
        <Text>{dayjs(status.createdAt).from(new Date())}</Text>
      </View>
    </Card>
  );
}
