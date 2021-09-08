import { Ref } from "./Ref";
import { SharedObject } from "./SharedObject";

export type MetadataModel = "dataSets" | "programs" | "dashboards";

export type MetadataPayload = Record<string, MetadataItem[]>;

export type MetadataItem = Ref & SharedObject & { [key: string]: any | undefined };

export function isValidModel(model: string): model is MetadataModel {
    return ["dataSets", "programs", "dashboards"].includes(model);
}

export function isValidMetadataItem(item: any): item is MetadataItem {
    return item.id && item.publicAccess && item.userAccesses && item.userGroupAccesses;
}
