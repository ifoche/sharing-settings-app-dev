import { FutureData } from "../entities/Future";

export interface MetadataRepository {
    list(options: ListOptions): FutureData<MetadataResponse>;
    getDependencies(options: GetDependenciesOptions[]): FutureData<Payload>;
}

export interface ListOptions {
    model: GetMetadataModel;
    page?: number;
    pageSize?: number;
    search?: string;
    sorting?: { field: string; order: "asc" | "desc" };
}

export type GetMetadataModel = "dataSets" | "programs" | "dashboards";

export type GetDependenciesOptions = { model: GetMetadataModel; id: string };

export type Payload = Record<string, MetadataItem[]>;

export type MetadataItem = { id: string; [key: string]: string | number | boolean | undefined };

export interface MetadataResponse {
    objects: MetadataItem[];
    pager: Pager;
}

export interface Pager {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
}
