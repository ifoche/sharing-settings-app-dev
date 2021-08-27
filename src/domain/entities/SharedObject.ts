import { NamedRef } from "./Ref";

export interface SharingSetting extends NamedRef {
    access: string;
}

export interface SharedObject {
    publicAccess: string;
    userAccesses: SharingSetting[];
    userGroupAccesses: SharingSetting[];
}
