import { Controller } from "react-hook-form";
import {
  Button,
  GridList,
  GridListItem,
  Spacings,
  Switch,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { useCreateStatusContext } from "./create-status-context";
import { useNavigation } from "expo-router";
import { emotionsData, reasonsData } from "../shared/icons-data";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollView } from "react-native";

export function CreateStatus() {
  const queryClient = useQueryClient();
  const {
    form: { control, formState, reset, setError, handleSubmit },
    mutation,
  } = useCreateStatusContext();

  const { goBack } = useNavigation();

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        goBack();
        reset();
      },
      onError(err) {
        setError("root", err);
      },
      onSettled() {
        queryClient.invalidateQueries();
      },
    });
  });

  return (
    <ScrollView>
      <View gap-6 padding-10>
        <View gap-6>
          <View row spread>
            <Text>Note</Text>
            <Controller
              control={control}
              name="isNotePublic"
              render={({ field: { value, onChange } }) => (
                <View row gap-4>
                  <Text>public</Text>
                  <Switch value={value ?? undefined} onValueChange={onChange} />
                </View>
              )}
            />
          </View>
          <Controller
            control={control}
            name="note"
            render={({ field: { value, onChange } }) => (
              <TextField
                value={value ?? undefined}
                onChangeText={onChange}
                multiline={true}
                numberOfLines={3}
                style={{
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 6,
                }}
              />
            )}
          />
          <View gap-6>
            <View row spread>
              <Text>Emotion</Text>
              <Text color="red">{formState.errors.emotion?.message}</Text>
            </View>
            <GridList
              scrollEnabled={false}
              renderItem={({ item: { image, label } }) => (
                <Controller
                  control={control}
                  key={label}
                  name="emotion"
                  render={({ field: { value, onChange } }) => (
                    <GridListItem
                      containerStyle={{
                        alignSelf: "center",
                        backgroundColor:
                          label === value ? "#00ff00" : "transparent",
                        width: "100%",
                        paddingVertical: 10,
                        borderRadius: 10,
                      }}
                      imageProps={{ source: image }}
                      onPress={() => onChange(label)}
                    />
                  )}
                />
              )}
              numColumns={4}
              itemSpacing={Spacings.s3}
              listPadding={Spacings.s5}
              data={emotionsData}
            />
          </View>

          <View gap-6>
            <View row spread>
              <Text>Reason</Text>
              <Text color="red">{formState.errors.reason?.message}</Text>
            </View>
            <GridList
              scrollEnabled={false}
              renderItem={({ item: { image, label } }) => (
                <Controller
                  control={control}
                  key={label}
                  name="reason"
                  render={({ field: { value, onChange } }) => (
                    <GridListItem
                      containerStyle={{
                        alignSelf: "center",
                        backgroundColor:
                          label === value ? "#00ff00" : "transparent",
                        width: "100%",
                        paddingVertical: 10,
                        borderRadius: 10,
                      }}
                      imageProps={{ source: image }}
                      onPress={() => onChange(label)}
                    />
                  )}
                />
              )}
              numColumns={4}
              itemSpacing={Spacings.s3}
              listPadding={Spacings.s5}
              data={reasonsData}
            />
          </View>
        </View>

        <View row gap-12 marginT-30>
          <Controller
            control={control}
            name="isStatusPublic"
            render={({ field: { value, onChange } }) => {
              return (
                <View>
                  <Text>Public</Text>
                  <Switch value={value ?? undefined} onValueChange={onChange} />
                </View>
              );
            }}
          />
          <Button flex-1 onPress={onSubmit} label="Emote" />
        </View>
        {Boolean(formState.errors.root) && (
          <Text color="red">error: {formState.errors.root?.message}</Text>
        )}
      </View>
    </ScrollView>
  );
}
