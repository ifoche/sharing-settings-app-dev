import _ from "lodash";
import { FutureData } from "../../entities/Future";
import { MetadataRepository } from "../../repositories/MetadataRepository";
import { MetadataPayload } from "../../entities/MetadataItem";
import { MetadataSharing } from "../../entities/MetadataSharing";

export class GetMetadataSharingUseCase {
    constructor(private metadataRepository: MetadataRepository) {}

    public execute(ids: string[]): FutureData<MetadataSharing[]> {
        return this.metadataRepository.getMetadataWithChildren(ids).map(result => {
            const metadataSharings = this.getMetadataSharingsWithChildren(result, ids);

            return metadataSharings
                .map(item => {
                    const children = item.children.filter(child => !_.isEqual(child.sharing, item.sharing));

                    return {
                        ...item,
                        children: children,
                    };
                })
                .filter(item => !_.isEmpty(item.children));
        });
    }

    private getMetadataSharingsWithChildren(result: MetadataPayload[], ids: string[]): MetadataSharing[] {
        return _(result)
            .flatMap(itemGroup =>
                ids.map(parentId => {
                    const parentItem = _.flatMap(Object.values(itemGroup)).find(({ id }) => id === parentId);
                    const children = _.flatMap(Object.values(itemGroup)).filter(
                        ({ id, sharing }) => id && sharing && id !== parentId
                    );

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
