import { useQuery } from "@tanstack/react-query";
import { myStatusesQueryOptions } from "./my-statuses-service";
import { useSession } from "@/shared/auth/core";
import { Status } from "../shared/status";
import { GridList, Spacings, View } from "react-native-ui-lib";
import { FlatList, ScrollView } from "react-native";

export function MyStatuses() {
  const { session } = useSession();
  const { data } = useQuery(myStatusesQueryOptions({ session }));

  return (
    <View marginT-20 marginB-90>
      {Boolean(data) && (
        <FlatList
          scrollEnabled
          data={data}
          renderItem={({ item }) => (
            <View key={item.id} paddingV-5>
              <Status displayName="You are" status={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}
