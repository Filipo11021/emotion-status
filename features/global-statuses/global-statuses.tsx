import { useQuery } from "@tanstack/react-query";
import { Status } from "../shared/status";
import { View } from "react-native-ui-lib";
import { globalStatusesQueryOptions } from "./global-statuses-service";
import { ReactNode } from "react";

export function GlobalStatuses(): ReactNode {
  const { data } = useQuery(globalStatusesQueryOptions);

  return (
    <View gap-8 padding-4>
      {data?.map((status) => (
        <Status
          displayName={`${status.profiles?.username} is`}
          key={status.id}
          status={status}
        />
      ))}
    </View>
  );
}
