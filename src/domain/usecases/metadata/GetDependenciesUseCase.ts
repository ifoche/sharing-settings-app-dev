import { UseCase } from "../../../CompositionRoot";
import { FutureData } from "../../entities/Future";
import { MetadataPayload, MetadataRepository } from "../../repositories/MetadataRepository";

export class GetDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(ids: string[]): FutureData<MetadataPayload> {
        return this.metadataRepository.getDependencies(ids);
    }
}
