import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { MetadataRepository, ListAllMetadataParams } from "../repositories/MetadataRepository";

export class GetAllMetadataUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: ListAllMetadataParams): FutureData<any> {
        return this.metadataRepository.listAllMetadata(params);
    }
}
