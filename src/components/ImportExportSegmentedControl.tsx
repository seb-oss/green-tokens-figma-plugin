import { Bold, SegmentedControl, Stack, Text } from "@create-figma-plugin/ui";
import { TargetedEvent, useContext } from "preact/compat";
import { h } from "preact";
import { PluginContext, PluginDispatchContext } from "../ui";

export function ImportExportSegmentedControl() {
  const state = useContext(PluginContext);
  const dispatch = useContext(PluginDispatchContext);
  return (
    <Stack space="extraSmall">
      <Text>
        <Bold>Import / Export</Bold>
      </Text>
      <SegmentedControl
        options={[
          { value: "import", children: "Import tokens" },
          {
            value: "export",
            children: "Export variables",
          },
        ]}
        value={state.importExport}
        onChange={(e: TargetedEvent<HTMLInputElement>) => {
          dispatch({
            type: "SET_IMPORT_EXPORT",
            importExport: e.currentTarget.value as "import" | "export",
          });
        }}
      />
    </Stack>
  );
}
