import { UseCase } from "../../../CompositionRoot";
import { FutureData } from "../../entities/Future";
import { ImportResult } from "../../entities/ImportResult";
import { MetadataPayload, MetadataRepository } from "../../repositories/MetadataRepository";

export class SaveSharingSettingsUseCase implements UseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(payload: MetadataPayload): FutureData<ImportResult> {
        return this.metadataRepository.save(payload);
    }
}
