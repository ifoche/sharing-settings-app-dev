import _ from "lodash";
import { FutureData } from "../../entities/Future";
import { MetadataRepository } from "../../repositories/MetadataRepository";
import { CodedRef, MetadataPayload } from "../../entities/MetadataItem";
import { SharingWarning, SharingSummary, SharingPayload } from "../../entities/SharingSummary";
import { SharingUpdate } from "../../entities/SharingUpdate";
import { NamedRef } from "../../entities/Ref";

export class GetSharingSummaryUseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(update: SharingUpdate): FutureData<SharingSummary> {
        const { baseElements, excludedDependencies } = update;

        return this.metadataRepository.getMetadataWithChildren(baseElements).flatMap(payloads => {
            const metadataWithDifferentSharing = this.getMetadataWithDifferentSharing(payloads, baseElements);
            const sharingWarnings = this.cleanMetadataSharing(metadataWithDifferentSharing, excludedDependencies);
            const sharingPayload = this.getSharingPayload(payloads, excludedDependencies);

            return this.metadataRepository.getMetadataFromIds(excludedDependencies).map(payload => {
                const excludedMetadata = this.getExcludedMetadata(payload);

                return {
                    excludedMetadata: excludedMetadata,
                    sharingWarnings: sharingWarnings,
                    sharingPayload: sharingPayload,
                };
            });
        });
    }

    private getExcludedMetadata(payload: MetadataPayload): NamedRef[] {
        return _(payload)
            .values()
            .flatten()
            .map(metadataItem => ({ id: metadataItem.id, name: metadataItem.name }))
            .filter(metadataItem => metadataItem.id !== undefined && metadataItem.name !== undefined)
            .value();
    }

    private getSharingPayload(payloads: MetadataPayload[], excludedDependencies: string[]): SharingPayload {
        const metadataPayload: MetadataPayload = _.merge({}, ...payloads.map(payload => _.omit(payload, "date")));
        const sharingPayload = _(metadataPayload)
            .mapKeys((_, key) => this.metadataRepository.getModelName(key))
            .mapValues(payloads =>
                _(payloads)
                    .map(payload => ({ id: payload.id, name: payload.name, code: payload.code }))
                    .uniqBy("id")
                    .filter(payload => !excludedDependencies.includes(payload.id) && !isDefaultElement(payload))
                    .value()
            )
            .value();

        return _.pickBy(sharingPayload, value => !_.isEmpty(value));
    }

    private cleanMetadataSharing(
        metadataSharingWithChildren: SharingWarning[],
        excludedDependencies: string[]
    ): SharingWarning[] {
        return metadataSharingWithChildren
            .map(item => {
                const children = item.children.filter(child => {
                    const childSharing = {
                        userGroups: child.sharing.userGroups,
                        users: child.sharing.users,
                        public: child.sharing.public,
                    };
                    const parentSharing = {
                        userGroups: item.sharing.userGroups,
                        users: item.sharing.users,
                        public: item.sharing.public,
                    };

                    return (
                        !_.isEqual(childSharing, parentSharing) &&
                        !excludedDependencies.includes(child.id) &&
                        !isDefaultElement(child)
                    );
                });

                return {
                    ...item,
                    children: children,
                };
            })
            .filter(item => !_.isEmpty(item.children) && !excludedDependencies.includes(item.id));
    }

    private getMetadataWithDifferentSharing(payload: MetadataPayload[], parentIds: string[]): SharingWarning[] {
        return _(payload)
            .flatMap(payloadGroup =>
                parentIds.map(parentId => {
                    const parentItem = _(Object.values(payloadGroup))
                        .flatten()
                        .value()
                        .find(({ id }) => id === parentId);
                    const children = _(Object.values(payloadGroup))
                        .flatten()
                        .value()
                        .filter(({ id, sharing }) => id && sharing && id !== parentId);

                    return parentItem
                        ? {
                              id: parentItem.id,
                              name: parentItem.name,
                              code: parentItem.code,
                              sharing: parentItem.sharing,
                              children: children.map(child => ({
                                  id: child.id,
                                  name: child.name,
                                  code: child.code,
                                  sharing: child.sharing,
                              })),
                          }
                        : undefined;
                })
            )
            .compact()
            .value();
    }
}

const isDefaultElement = (metadataElement: CodedRef) => {
    return metadataElement.name === "default" || metadataElement.code === "default";
};
