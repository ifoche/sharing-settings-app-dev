import { SharingObject } from "./MetadataItem";

export type MetadataSharing = {
    id: string;
    name: string;
    sharing: SharingObject;
    children: {
        id: string;
        name: any;
        sharing: SharingObject;
    }[];
};
