import { Future, FutureData } from "../../../entities/Future";
import { ImportResult } from "../../../entities/ImportResult";
import { MetadataPayload } from "../../../entities/MetadataItem";
import { ListMetadataResponse, ListOptions, MetadataRepository } from "../../../repositories/MetadataRepository";
import { mergePayloads } from "../../../../data/repositories/MetadataD2ApiRepository";
import { dashboardProgram1 } from "./dashboardProgram1";
import { ApplySharingSettingsUseCase } from "../ApplySharingSettingsUseCase";
import _ from "lodash";

describe("Apply sharing settings use case", () => {
    let metadataRepository: MetadataRepository;
    let usecase: ApplySharingSettingsUseCase;
    const tests = [
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            strategy: "merge",
            users: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
            userGroups: [],
            publicAccess: "--------",
        },
    ];
    beforeEach(() => {
        metadataRepository = new MockMetadataRepository();
        usecase = new ApplySharingSettingsUseCase(metadataRepository);
    });
    for (const test in tests) {
        // TODO: Add more tests until we have a complete set of use cases
        it("dashboards and programs with users and no public access", async () => {
            usecase
                .execute({
                    baseElements: ["dashboard1", "dashboard2", "program1", "program2"],
                    excludedDependencies: [],
                    sharings: {
                        publicAccess: "--------", //test.publicAccess
                        userAccesses: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
                        userGroupAccesses: [],
                    },
                    replaceExistingSharings: false,
                })
                .run(
                    results => {
                        // TODO: Validate results, check that sharing settings have been applied
                        const resultsValue = _.values(results);
                        const allMdTypesTogether = [..._.flatten(resultsValue)];
                        allMdTypesTogether.forEach(arr => {
                            expect(arr.publicAccess).toBe("--------");
                            expect(arr.userAccesses).toContainEqual({
                                id: "s5EVHUwoFKu",
                                access: "rw------",
                                name: "Alexis Rico",
                            });
                        });
                    },
                    error => console.log(error)
                );
        });
    }
});

class MockMetadataRepository implements MetadataRepository {
    getDependencies(_ids: string[]): FutureData<MetadataPayload> {
        // TODO: Include a medium-sized complex payload
        const dictionary: Record<string, any> = {
            dashboard1: dashboardProgram1[0],
            dashboard2: dashboardProgram1[1],
            program1: dashboardProgram1[2],
            program2: dashboardProgram1[3],
        };

        const ff = mergePayloads(_ids.map(id => dictionary[id]));
        return Future.success(ff);
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
