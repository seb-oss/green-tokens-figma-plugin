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

export function NodeFinder({ node, layer }: { node: string; layer: string }) {
  const [value, setValue] = useState<boolean>(true);

  async function copyToClipboard(text: string) {
    try {
      // Use the modern clipboard API
      await navigator.clipboard.writeText(text);
      emit("COPIED_TO_CLIPBOARD", layer || node);
    } catch (err) {
      // Fallback to the older method if clipboard API fails
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        emit("COPIED_TO_CLIPBOARD", layer || node);
      } catch (e) {
        console.error("Copy failed", e);
      }

      document.body.removeChild(textarea);
    }
  }

  function handleCopyMarkdown() {
    // Ensure proper string escaping and formatting
    const markdownText = `<Figma id="${layer || ""}" />`;
    copyToClipboard(markdownText);
  }

  function handleCopyJson() {
    // Ensure proper string escaping and formatting
    const jsonText = `{ "node": "${node || ""}", "id": "${layer || ""}" },`;
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
        {`<Figma id="${layer || ""}" />`}
      </Layer>
      <Button onClick={() => handleCopyMarkdown()} secondary fullWidth>
        Copy Markdown
      </Button>
      <VerticalSpace space="extraSmall" />
      <Text>Json: {layer}</Text>
      <Layer
        component
        onChange={handleChange}
        value={value}
        icon={<IconLayerFrame16 />}
      >
        {`{ "node": "${node || ""}", "id": "${layer || ""}" },`}
      </Layer>
      <Button onClick={() => handleCopyJson()} secondary fullWidth>
        Copy Json
      </Button>
    </Stack>
  );
}
