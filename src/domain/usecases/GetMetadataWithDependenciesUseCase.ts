import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { GetDependenciesItem, MetadataPayload, MetadataRepository } from "../repositories/MetadataRepository";

export class GetMetadataDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: GetDependenciesItem[]): FutureData<MetadataPayload> {
        return this.metadataRepository.getDependencies(params);
    }
}
