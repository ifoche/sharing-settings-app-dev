import { FutureData } from "../entities/Future";

export interface MetadataRepository {
    listAllMetadata(options: ListAllMetadataParams): FutureData<any>;
    listMetadataWithDependencies(options: ListMetadataParams[]): FutureData<any>;
}

export interface ListAllMetadataParams {
    model: string;
    page?: number;
    pageSize?: number;
    search?: string;
    order?: [string, string];
}

export interface ListMetadataParams {
    model: string;
    id: string;
}
