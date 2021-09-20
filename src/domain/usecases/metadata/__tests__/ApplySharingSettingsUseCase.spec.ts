import { Future, FutureData } from "../../../entities/Future";
import { ImportResult } from "../../../entities/ImportResult";
import { MetadataPayload } from "../../../entities/MetadataItem";
import { ListMetadataResponse, ListOptions, MetadataRepository } from "../../../repositories/MetadataRepository";
import { ApplySharingSettingsUseCase } from "../ApplySharingSettingsUseCase";

describe("Apply sharing settings use case", () => {
    let metadataRepository: MetadataRepository;

    beforeEach(() => {
        metadataRepository = new MockMetadataRepository();
    });

    // TODO: Add more tests until we have a complete set of use cases
    it("should apply sharing settings", async () => {
        const usecase = new ApplySharingSettingsUseCase(metadataRepository);
        const results = usecase
            .execute({
                baseElements: [],
                excludedDependencies: [],
                sharings: {
                    publicAccess: "--------",
                    userAccesses: [],
                    userGroupAccesses: [],
                },
                replaceExistingSharings: false,
            })
            .toPromise();

        // TODO: Validate results, check that sharing settings have been applied
        expect(results).toBeDefined();
    });
});

class MockMetadataRepository implements MetadataRepository {
    getDependencies(_ids: string[]): FutureData<MetadataPayload> {
        // TODO: Include a medium-sized complex payload
        return Future.success({});
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
        throw new Error("Method not implemented.");
    }

    isDataShareable(_model: string): boolean {
        throw new Error("Method not implemented.");
    }
}

export { };

