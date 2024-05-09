import _ from "lodash";
import { MetadataRepository } from "../../repositories/MetadataRepository";
import { FutureData } from "../../entities/Future";
import { NamedRef } from "../../entities/Ref";

export class GetExcludedDependenciesMetadata {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(excludedDependencies: string[]): FutureData<NamedRef[]> {
        return this.metadataRepository.getMetadataFromIds(excludedDependencies).map(payload => {
            return _(payload)
                .values()
                .flatten()
                .map(metadataItem => ({ id: metadataItem.id, name: metadataItem.name }))
                .filter(metadataItem => metadataItem.id !== undefined && metadataItem.name !== undefined)
                .value();
        });
    }
}
