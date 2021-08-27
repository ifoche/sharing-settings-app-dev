export type Id = string;

export interface Ref {
    id: Id;
}

export interface NamedRef extends Ref {
    name: string;
}

export interface SharingSetting extends NamedRef {
    access: string;
}
