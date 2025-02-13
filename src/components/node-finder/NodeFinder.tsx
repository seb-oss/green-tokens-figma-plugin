import { JSX, h } from "preact";
import { emit } from "@create-figma-plugin/utilities";
import {
  Text,
  Button,
  Stack,
  Layer,
  Divider,
  IconLayerFrame16,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { useState } from "preact/hooks";

export function NodeFinder({ node }: { node: string }) {
  const [value, setValue] = useState<boolean>(true);

  function copyToClipboard(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    emit("COPIED_TO_CLIPBOARD", node);
  }

  function handleCopyMarkdown() {
    const markdownText = `<Figma node="${node}" caption=" " />`;
    copyToClipboard(markdownText);
  }

  function handleCopyJson() {
    const jsonText = `{ "node": "${node}", "id": "_UNIQUE_ID_" }`;
    copyToClipboard(jsonText);
  }

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.checked;
    setValue(newValue);
  }

  return (
    <Stack space="small">
      <VerticalSpace space="small" />
      <Text>Markdown:</Text>
      <Layer onChange={handleChange} value={value} icon={<IconLayerFrame16 />}>
        {/* {`<Figma id="${node}" caption=" " />`} */}
        {`<Figma id="__ID__" caption=" " />`}
      </Layer>
      <Button onClick={handleCopyMarkdown} secondary fullWidth>
        Copy Markdown
      </Button>
      <VerticalSpace space="extraSmall" />
      <Divider />
      <VerticalSpace space="extraSmall" />
      <Text>Json:</Text>
      <Layer
        component
        onChange={handleChange}
        value={value}
        icon={<IconLayerFrame16 />}
      >
        {`{ "node": "${node}", "id": "_UNIQUE_ID_" },`}
      </Layer>
      <Button onClick={handleCopyJson} secondary fullWidth>
        Copy Json
      </Button>
    </Stack>
  );
}
