import { CodedRef, SharingObject } from "./MetadataItem";

type MetadataSharing = CodedRef & {
    sharing: SharingObject;
};

export type SharingWarning = MetadataSharing & {
    children: MetadataSharing[];
};

export type SharingPayload = Record<string, CodedRef[]>;

export interface SharingSummary {
    sharingWarnings: SharingWarning[];
    sharingPayload: SharingPayload;
}
