import { emit, on, showUI } from "@create-figma-plugin/utilities";
const { getLocalVariableCollectionsAsync, getLocalVariablesAsync, getVariableCollectionByIdAsync, createVariable } = figma.variables;
import chroma from "chroma-js";

/**
 *
 * We need to get the local variables and collections and call the getters on each property.
 * If we don't do this the values will be undefined when passed to the UI.
 * @returns { Promise<{localVariables: {id: string, name: string, collectionId: string}[], localCollections: {id: string, name: string, modes: {modeId: string, name: string}[], defaultModeId: string}[]}>}
 */
async function getLocalData() {
  const localVariables = (await getLocalVariablesAsync()).map((v) => ({
    id: v.id,
    name: v.name,
    collectionId: v.variableCollectionId,
    resolvedType: v.resolvedType,
    description: v.description,
    valuesByMode: v.valuesByMode,
  }));

  const localCollections = (await getLocalVariableCollectionsAsync()).map((c) => ({
    id: c.id,
    name: c.name,
    modes: c.modes,
    defaultModeId: c.defaultModeId,
  }));

  return { localVariables, localCollections };
}

function hexToFigmaColor(color: string) {
  return {
    r: chroma(color).rgba()[0] / 255,
    g: chroma(color).rgba()[1] / 255,
    b: chroma(color).rgba()[2] / 255,
    a: chroma(color).rgba()[3],
  };
}

interface Token {
  name: string;
  resolvedType: VariableResolvedDataType;
  value: string;
}

interface VariableUpdate {
  id: string;
  value: string;
}

interface ImportPayload {
  variablesToCreate: Token[];
  variablesToUpdate: VariableUpdate[];
  collectionId: string;
  modeId: string;
}

export default () => {
  on("EXECUTE_IMPORT", async ({ variablesToCreate, variablesToUpdate, collectionId, modeId }: ImportPayload) => {
    try {
      const variableCollection = await getVariableCollectionByIdAsync(collectionId);
      if (!variableCollection || !modeId) throw new Error("Variable collection or modeId not found");

      for (let index = 0; index < variablesToCreate.length; index++) {
        const token = variablesToCreate[index];

        const createdVariable = createVariable(token.name, variableCollection, token.resolvedType);

        if (createdVariable.resolvedType === "COLOR") {
          if (modeId && token.value) {
            createdVariable.setValueForMode(modeId, hexToFigmaColor(token.value));
          }
        }

        if (createdVariable.resolvedType === "FLOAT") {
          if (modeId && token.value) {
            createdVariable.setValueForMode(modeId, parseFloat(token.value));
          }
        }

        if (createdVariable.resolvedType === "STRING") {
          if (modeId && token.value) {
            createdVariable.setValueForMode(modeId, token.value);
          }
        }
      }

      for (let index = 0; index < variablesToUpdate.length; index++) {
        const variable = variablesToUpdate[index];
        const existingVariable = figma.variables.getVariableById(variable.id);

        if (existingVariable) {
          if (existingVariable.resolvedType === "COLOR") {
            if (modeId && variable.value) {
              existingVariable.setValueForMode(modeId, hexToFigmaColor(variable.value));
            }
          }

          if (existingVariable.resolvedType === "FLOAT") {
            if (modeId && variable.value) {
              existingVariable.setValueForMode(modeId, parseFloat(variable.value));
            }
          }

          if (existingVariable.resolvedType === "STRING") {
            if (modeId && variable.value) {
              existingVariable.setValueForMode(modeId, variable.value);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      figma.notify(`Import failed: ${errorMessage}`);
      emit("IMPORT_FAILED", errorMessage);
      return;
    }

    getLocalData().then((data) => {
      emit("SET_LOCAL_DATA", data);
      emit("IMPORT_FINISHED");
    });
  });

  on("EXPORT_VARIABLES", async () => {
    const collections = await getLocalVariableCollectionsAsync();

    const variables = (await getLocalVariablesAsync()).map((item) => ({
      name: item.name,
      id: item.id,
      variableCollection: collections.find((collection) => collection.id === item.variableCollectionId),
      description: item.description,
      valuesByMode: item.valuesByMode,
      resolvedType: item.resolvedType,
    }));

    emit("SAVE_VARIABLES_TO_FILE", variables as any);
  });

  figma.on("selectionchange", () => {
    const selectedNodes = figma.currentPage.selection;
    if (selectedNodes.length > 0) {
      const nodeId = selectedNodes[0].id.replace(":", "-");
      emit("NODE_SELECTED", nodeId);
    } else {
      emit("NODE_SELECTED", null);
    }
  });

  on("COPIED_TO_CLIPBOARD", (message) => {
    figma.notify(`${message} copied to clipboard!`);
  });

  showUI({ height: 400, width: 320 });

  getLocalData().then((data) => emit("SET_LOCAL_DATA", data));
};
