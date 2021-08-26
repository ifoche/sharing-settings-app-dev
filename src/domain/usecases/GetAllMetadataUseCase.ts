import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { MetadataRepository, ListAllMetadataParams, MetadataObject } from "../repositories/MetadataRepository";
//Payload,
export class GetAllMetadataUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(params: ListAllMetadataParams): FutureData<MetadataObject> {
        return this.metadataRepository.listAllMetadata(params);
    }
}
