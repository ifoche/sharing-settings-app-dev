import _ from "lodash";
import { FutureData } from "../../entities/Future";
import { MetadataRepository } from "../../repositories/MetadataRepository";
import { MetadataPayload } from "../../entities/MetadataItem";
import { SharingWarning, SharingSummary } from "../../entities/MetadataSharing";

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

    private getSharingPayload(payloads: MetadataPayload[]) {
        const metadataPayload: MetadataPayload = _.merge({}, ...payloads.map(payload => _.omit(payload, "date")));

        return _(metadataPayload)
            .mapKeys((_, key) => this.metadataRepository.getModelName(key))
            .mapValues(payloads =>
                _(payloads)
                    .map(payload => ({ id: payload.id, name: payload.name }))
                    .uniqBy("id")
                    .value()
            )
            .value();
    }

    private cleanMetadataSharing(metadataSharingWithChildren: SharingWarning[]): SharingWarning[] {
        return metadataSharingWithChildren
            .map(item => {
                const children = item.children.filter(child => !_.isEqual(child.sharing, item.sharing));

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
                              sharing: parentItem.sharing,
                              children: children.map(child => ({
                                  id: child.id,
                                  name: child.name,
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
