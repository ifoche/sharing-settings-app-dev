import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { GetDependenciesItem, MetadataRepository, Payload } from "../repositories/MetadataRepository";

export class GetMetadataDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: GetDependenciesItem[]): FutureData<Payload> {
        return this.metadataRepository.getDependencies(params);
    }
}
