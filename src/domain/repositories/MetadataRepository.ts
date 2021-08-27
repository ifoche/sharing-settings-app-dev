import { FutureData } from "../entities/Future";

export interface MetadataRepository {
    list(options: ListOptions): FutureData<MetadataResponse>;
    getDependencies(items: GetDependenciesItem[]): FutureData<Payload>;
}

export interface ListOptions {
    model: MetadataModel;
    page?: number;
    pageSize?: number;
    search?: string;
    sorting?: { field: string; order: "asc" | "desc" };
}

export type MetadataModel = "dataSets" | "programs" | "dashboards";

export type GetDependenciesItem = { model: MetadataModel; id: string };

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
