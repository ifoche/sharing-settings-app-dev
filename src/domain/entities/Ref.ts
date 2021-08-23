import { GetSchemaType, Schema } from "../../utils/codec";

export type Id = string;

export interface Ref {
    id: Id;
}

export interface NamedRef extends Ref {
    name: string;
}

export const SharingSettingModel = Schema.object({
    access: Schema.string,
    id: Schema.dhis2Id,
    name: Schema.string,
});

export type SharingSetting = GetSchemaType<typeof SharingSettingModel>;
