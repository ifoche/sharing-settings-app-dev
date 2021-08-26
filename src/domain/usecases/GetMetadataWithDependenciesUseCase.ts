import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { MetadataRepository, GetMetadataDependenciesOptions, MetadataItem } from "../repositories/MetadataRepository";

export class GetMetadataWithDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: GetMetadataDependenciesOptions[]): FutureData<MetadataItem[]> {
        return this.metadataRepository.listMetadataWithDependencies(params);
    }
}
