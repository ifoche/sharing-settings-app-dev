import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { ListOptions, MetadataRepository, MetadataResponse } from "../repositories/MetadataRepository";

export class ListMetadataUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: ListOptions): FutureData<MetadataResponse> {
        return this.metadataRepository.list(params);
    }
}
