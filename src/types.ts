import {EventHandler} from '@create-figma-plugin/utilities'
import {JSX} from "preact";
import {InterimVariable} from "./classes/InterimVariable";

export type ImportMode = 'ref' | 'sys'

export interface ImportStateComponentEnum {
    ready: JSX.Element
    approve: JSX.Element
    loading: JSX.Element
    finished: JSX.Element
}

export type ImportState = keyof ImportStateComponentEnum;

export interface IPluginState extends PreparedVariables {
    errorMsg: string | null
    successMsg: string | null
    importExport: 'import' | 'export'
    importMode: ImportMode
    importState: ImportState
    localVariables: Pick<IVariable, "id" | "name">[]
    localCollections: Pick<VariableCollection, "id" | "name">[]
}

interface SetLocalVariables {
    type: 'SET_LOCAL_VARIABLES'
    localVariables: Pick<IVariable, "id" | "name">[]
}

interface SetLocalCollections {
    type: 'SET_LOCAL_COLLECTIONS'
    localCollections: Pick<VariableCollection, "id" | "name">[]
}

interface ImportExportAction {
    type: 'SET_IMPORT_EXPORT'
    importExport: 'import' | 'export'
}

interface ImportModeAction {
    type: 'SET_IMPORT_MODE'
    importMode: ImportMode
}

interface ImportStateAction {
    type: 'SET_IMPORT_STATE'
    importState: ImportState
}

interface ErrorAction {
    type: 'SET_ERROR_MESSAGE'
    errorMsg: string | null
}

interface PreparedVariables {
    refToBeCreated: InterimVariable[]
    refToBeUpdated: InterimVariable[]
    sysToBeCreated: InterimVariable[]
    sysToBeUpdated: InterimVariable[]
}

interface PreparedDataAction {
    type: 'SET_PREPARED_DATA'
    data: PreparedVariables
}

export type ReducerAction =
    ImportExportAction
    | ImportModeAction
    | ImportStateAction
    | ErrorAction
    | PreparedDataAction
    | SetLocalVariables
    | SetLocalCollections

export interface IPluginReducerAction extends IPluginState {
    type: string
}

export interface ImportTokensHandler extends EventHandler {
    name: 'IMPORT_TOKENS'
    handler: (json: string, importMode: string) => void
}

export interface ReportErrorHandler extends EventHandler {
    name: 'REPORT_ERROR'
    handler: (msg: string | null) => void
}

export interface VariablesPreparedHandler extends EventHandler {
    name: 'VARIABLES_PREPARED'
    handler: (args: PreparedVariables) => void
}

export interface Token {
    id?: string
    description?: string
    value: string | VariableAlias
    darkValue?: string | VariableAlias
    filePath?: string
    name: string
    attributes: {
        figma: {
            id: string
            resolvedType: VariableResolvedDataType
            collectionId: VariableResolvedDataType
            alias: boolean
            originalLightId: string
            originalLightName: string
            originalDarkId: string
            originalDarkName: string
            matchedVariable?: {
                id: string
                name: string
            }
        }
    }
    path: string[]
}

export interface FigmaColor {
    r: number,
    g: number,
    b: number,
    a: number

}

export interface Mode {
    [key: string]: string | number | FigmaColor
}

export interface Collection {
    name: string
}

export interface IVariable {
    id?: string
    name: string
    description?: string
    variableCollectionId?: string
    valuesByMode: Mode
    tokenCollection: string
    type: VariableResolvedDataType | 'ALIAS'
}

export interface TokensCategory {
    [property: string]: TokensCategory | Token
}

export interface Tokens {
    ref: TokensCategory,
    sys: TokensCategory
}