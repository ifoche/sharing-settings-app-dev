import { SharingObject } from "./MetadataItem";
import { NamedRef } from "./Ref";

type MetadataSharing = {
    id: string;
    name: string;
    sharing: SharingObject;
};

export type SharingWarning = MetadataSharing & {
    children: MetadataSharing[];
};

export interface SharingSummary {
    sharingWarnings: SharingWarning[];
    sharingPayload: Record<string, NamedRef[]>;
}
