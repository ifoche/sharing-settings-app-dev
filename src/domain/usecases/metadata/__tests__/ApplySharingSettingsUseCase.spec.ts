import _ from "lodash";
import { mergePayloads } from "../../../../data/repositories/MetadataD2ApiRepository";
import { Future, FutureData } from "../../../entities/Future";
import { ImportResult } from "../../../entities/ImportResult";
import { MetadataPayload } from "../../../entities/MetadataItem";
import { SharingUpdate } from "../../../entities/SharingUpdate";
import { ListMetadataResponse, ListOptions, MetadataRepository } from "../../../repositories/MetadataRepository";
import { ApplySharingSettingsUseCase } from "../ApplySharingSettingsUseCase";
import { metadata, tests } from "./ApplySharingSettingsUseCase.metadata";

describe("Apply sharing settings use case", () => {
    let metadataRepository: MetadataRepository;
    let usecase: ApplySharingSettingsUseCase;

    beforeAll(() => {
        metadataRepository = new MockMetadataRepository();
        usecase = new ApplySharingSettingsUseCase(metadataRepository);
    });

    for (const update of tests) {
        it(buildTitle(update), async () => {
            const { baseElements, excludedDependencies, sharings, replaceExistingSharings } = update;
            const { data: result, error } = await usecase.execute(update).runAsync();
            expect(error).toBeUndefined();
            const items = _(result).values().flatten().value();
            const itemIds = items.map(item => item.id);

            const metadata = await metadataRepository.getDependencies(baseElements).toPromise();
            const metadataItems = _(metadata).values().flatten().value();

            // Check excluded dependencies are not in the payload
            expect(_.intersection(itemIds, excludedDependencies)).toEqual([]);

            // Check public access has been updated
            expect(_.every(items, ({ publicAccess }) => publicAccess === sharings.publicAccess)).toBe(true);

            if (replaceExistingSharings) {
                // If strategy is replace, check that the sharings are replaced
                for (const item of items) {
                    expect(item.userAccesses).toEqual(sharings.userAccesses);
                    expect(item.userGroupAccesses).toEqual(sharings.userGroupAccesses);
                }
            } else {
                // If strategy is merge, check that the sharings are merged
                for (const item of items) {
                    const { userAccesses = [], userGroupAccesses = [] } =
                        metadataItems.find(({ id }) => id === item.id) ?? {};

                    expect(item.userAccesses).toEqual(
                        _.uniqBy([...sharings.userAccesses, ...userAccesses], ({ id }) => id)
                    );

                    expect(item.userGroupAccesses).toEqual(
                        _.uniqBy([...sharings.userGroupAccesses, ...userGroupAccesses], ({ id }) => id)
                    );
                }
            }
        });
    }
});

function buildTitle(update: SharingUpdate): string {
    const { excludedDependencies, sharings, replaceExistingSharings } = update;
    const { publicAccess, userAccesses, userGroupAccesses } = sharings;

    const message = [
        excludedDependencies.length !== 0 ? "excluding elements" : "no excluding elements",
        publicAccess === "--------" ? "no public access" : "public access",
        userAccesses.length === 0 ? "no users" : "users",
        userGroupAccesses.length === 0 ? "no userGroups" : "userGroups",
        `${replaceExistingSharings ? "replace" : "merge"} strategy`,
    ].join(", ");

    return `Should apply sharing setting with ${message}`;
}

class MockMetadataRepository implements MetadataRepository {
    getDependencies(_ids: string[]): FutureData<MetadataPayload> {
        const payloads = mergePayloads(_ids.map(id => metadata[id] ?? {}));
        return Future.success(payloads);
    }

    list(_options: ListOptions): FutureData<ListMetadataResponse> {
        throw new Error("Method not implemented.");
    }

    save(_payload: MetadataPayload): FutureData<ImportResult> {
        throw new Error("Method not implemented.");
    }

    getModelName(_model: string): string {
        throw new Error("Method not implemented.");
    }

    isShareable(_model: string): boolean {
        return true;
        //throw new Error("Method not implemented.");
    }

    isDataShareable(_model: string): boolean {
        return true;
        //throw new Error("Method not implemented.");
    }
}

export {};
