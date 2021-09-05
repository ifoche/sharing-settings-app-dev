import { UseCase } from "../../CompositionRoot";
import { FutureData } from "../entities/Future";
import { MetadataPayload, MetadataRepository } from "../repositories/MetadataRepository";
import { MetadataResponse } from "../../types/d2-api";

export class SaveMetadataSharingSettingsUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(payload: MetadataPayload): FutureData<MetadataResponse> {
        return this.metadataRepository.save(payload);
    }
}
