import { FutureData } from "../entities/Future";

export interface MetadataRepository {
    listAllMetadata(options: ListAllMetadataParams): FutureData<MetadataObject>;
    listMetadataWithDependencies(options: GetMetadataDependenciesOptions[]): FutureData<MetadataItem[]>;
}

export interface ListAllMetadataParams {
    model: GetMetadataModel;
    page?: number;
    pageSize?: number;
    search?: string;
    sorting?: { field: string; order: "asc" | "desc" };
}

export type GetMetadataModel = "dataSets" | "programs" | "dashboards";

export type GetMetadataDependenciesOptions = { model: GetMetadataModel; id: string };

export type Payload = Record<string, MetadataItem[]>;

export type MetadataItem = { id: string; [key: string]: string | number | boolean | undefined };

export interface MetadataObject {
    objects: MetadataItem[];
    pager: Pager;
}

export interface Pager {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
}
