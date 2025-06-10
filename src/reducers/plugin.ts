import { IPluginState, ReducerAction } from "../types";

export function pluginReducer(state: IPluginState, action: ReducerAction): IPluginState {
  if (action.type === "SET_IMPORT_STATE") {
    return {
      ...state,
      importState: action.importState,
    };
  }
  if (action.type === "SET_LOCAL_VARIABLES") {
    return {
      ...state,
      localVariables: action.localVariables,
    };
  }
  if (action.type === "SET_LOCAL_COLLECTIONS") {
    return {
      ...state,
      localCollections: action.localCollections.map((col: any) => ({
        ...col,
        modes: col.modes ?? [],
        defaultModeId: col.defaultModeId ?? "",
      })),
    };
  }
  if (action.type === "SET_ERROR_MESSAGE") {
    return {
      ...state,
      errorMsg: action.errorMsg,
    };
  }
  if (action.type === "SET_IMPORT_MODE") {
    return {
      ...state,
      importMode: action.importMode,
    };
  }
  if (action.type === "SET_IMPORT_EXPORT") {
    if (action.importExport) {
      return {
        ...state,
        importExport: action.importExport,
      };
    }

    return state;
  }
  if (action.type === "SET_TOKENS_TO_IMPORT") {
    return {
      ...state,
      variablesToCreate: action.tokens.variablesToBeCreated,
      variablesToUpdate: action.tokens.variablesToBeUpdated,
    };
  }
  if (action.type === "SET_IMPORT_TO_COLLECTION") {
    return {
      ...state,
      importToCollection: action.importToCollection,
    };
  }
  if (action.type === "SET_IMPORT_TO_MODE") {
    return {
      ...state,
      importToMode: action.importToMode,
    };
  }

  return state;
}
