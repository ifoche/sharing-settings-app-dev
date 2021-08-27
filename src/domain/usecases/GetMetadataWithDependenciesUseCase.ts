import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { GetDependenciesOptions, MetadataRepository, Payload } from "../repositories/MetadataRepository";

export class GetMetadataDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: GetDependenciesOptions[]): FutureData<Payload> {
        return this.metadataRepository.getDependencies(params);
    }
}
