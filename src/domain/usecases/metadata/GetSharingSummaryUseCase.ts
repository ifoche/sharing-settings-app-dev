import _ from "lodash";
import { FutureData } from "../../entities/Future";
import { MetadataRepository } from "../../repositories/MetadataRepository";
import { MetadataPayload } from "../../entities/MetadataItem";
import { SharingWarning, SharingSummary, SharingPayload } from "../../entities/MetadataSharing";

export class GetSharingSummaryUseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(ids: string[]): FutureData<SharingSummary> {
        return this.metadataRepository.getMetadataWithChildren(ids).map(payloads => {
            const metadataSharingsWithChildren = this.getMetadataSharingWithChildren(payloads, ids);
            const sharingWarnings = this.cleanMetadataSharing(metadataSharingsWithChildren);
            const sharingPayload = this.getSharingPayload(payloads);

            return {
                sharingWarnings: sharingWarnings,
                sharingPayload: sharingPayload,
            };
        });
    }

    private getSharingPayload(payloads: MetadataPayload[]): SharingPayload {
        const metadataPayload: MetadataPayload = _.merge({}, ...payloads.map(payload => _.omit(payload, "date")));
        const sharingPayload = _(metadataPayload)
            .mapKeys((_, key) => this.metadataRepository.getModelName(key))
            .mapValues(payloads =>
                _(payloads)
                    .map(payload => ({ id: payload.id, name: payload.name, code: payload.code }))
                    .uniqBy("id")
                    .filter(payload => payload.name !== "default" && payload.code !== "default")
                    .value()
            )
            .value();

        return _.pickBy(sharingPayload, value => !_.isEmpty(value));
    }

    private cleanMetadataSharing(metadataSharingWithChildren: SharingWarning[]): SharingWarning[] {
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
                        !_.isEqual(childSharing, parentSharing) && child.name !== "default" && child.code !== "default"
                    );
                });

                return {
                    ...item,
                    children: children,
                };
            })
            .filter(item => !_.isEmpty(item.children));
    }

    private getMetadataSharingWithChildren(payload: MetadataPayload[], parentIds: string[]): SharingWarning[] {
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
