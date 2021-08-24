import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { MetadataRepository, ListMetadataParams } from "../repositories/MetadataRepository";

export class GetMetadataWithDependenciesUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: ListMetadataParams[]): FutureData<any> {
        return this.metadataRepository.listMetadataWithDependencies(params);
    }
}
