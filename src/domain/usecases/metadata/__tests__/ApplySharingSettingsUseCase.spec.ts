/* eslint-disable no-loop-func */
import { Future, FutureData } from "../../../entities/Future";
import { ImportResult } from "../../../entities/ImportResult";
import { MetadataPayload } from "../../../entities/MetadataItem";
import { ListMetadataResponse, ListOptions, MetadataRepository } from "../../../repositories/MetadataRepository";
import { mergePayloads } from "../../../../data/repositories/MetadataD2ApiRepository";
import { dashboardProgram1 } from "./dashboardProgram1";
import { ApplySharingSettingsUseCase } from "../ApplySharingSettingsUseCase";
import { SharingSetting } from "../../../entities/SharedObject";

import _ from "lodash";

interface TestCase {
    ids: string[];
    excludedIds: string[];
    strategy: string;
    users: SharingSetting[];
    userGroups: SharingSetting[];
    publicAccess: string;
}
describe("Apply sharing settings use case", () => {
    let metadataRepository: MetadataRepository;
    let usecase: ApplySharingSettingsUseCase;

    const tests: TestCase[] = [
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "merge",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "rw------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "merge",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "--------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "merge",
            users: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
            userGroups: [],
            publicAccess: "--------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: [],
            strategy: "merge",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "rw------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: [],
            strategy: "merge",
            users: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
            userGroups: [],
            publicAccess: "--------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "replace",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "rw------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "replace",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "--------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: ["dTenEaC7Qeu", "oMz2k4EvzR8"],
            strategy: "replace",
            users: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
            userGroups: [],
            publicAccess: "--------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: [],
            strategy: "replace",
            users: [],
            userGroups: [{ id: "sCjEPgiOhP1", access: "rw------", name: "WIDP admins" }],
            publicAccess: "rw------",
        },
        {
            ids: ["dashboard1", "dashboard2", "program1", "program2"],
            excludedIds: [],
            strategy: "replace",
            users: [{ id: "s5EVHUwoFKu", access: "rw------", name: "Alexis Rico" }],
            userGroups: [],
            publicAccess: "--------",
        },
    ];
    beforeEach(() => {
        metadataRepository = new MockMetadataRepository();
        usecase = new ApplySharingSettingsUseCase(metadataRepository);
    });
    for (const test of tests) {
        // TODO: Add more tests until we have a complete set of use casestest.users.length !== 0 && "users,"
        it(`should apply sharing setting with ${
            test.excludedIds.length !== 0 ? "excluding elements" : "no excluding elements"
        }, ${test.publicAccess === "--------" ? "no public access" : "public access"}, ${
            test.users.length === 0 ? "no users" : "users"
        }, ${test.userGroups.length === 0 ? "no userGroups" : "userGroups"}, and ${
            test.strategy
        } strategy to dashboards and programs`, async () => {
            usecase
                .execute({
                    baseElements: test.ids,
                    excludedDependencies: test.excludedIds,
                    sharings: {
                        publicAccess: test.publicAccess,
                        userAccesses: test.users,
                        userGroupAccesses: test.userGroups,
                    },
                    replaceExistingSharings: test.strategy === "merge" ? false : true,
                })
                .run(
                    results => {
                        // TODO: Validate results, check that sharing settings have been applied
                        const resultsValue = _.values(results);
                        const allMdTypesTogether = [..._.flatten(resultsValue)];
                        allMdTypesTogether.forEach(arr => {
                            if (!test.excludedIds.includes(arr.id)) {
                                expect(arr.publicAccess).toBe(test.publicAccess);
                                if (test.strategy === "replace") {
                                    expect(arr.userAccesses).toHaveLength(test.users.length);
                                    test.users.forEach(user => expect(arr.userAccesses).toContainEqual(user));
                                    expect(arr.userGroupAccesses).toHaveLength(test.userGroups.length);
                                    test.userGroups.forEach(userGroup =>
                                        expect(arr.userGroupAccesses).toContainEqual(userGroup)
                                    );
                                } else {
                                    test.users.length !== 0 &&
                                        test.users.forEach(user => expect(arr.userAccesses).toContainEqual(user));
                                    test.userGroups.length !== 0 &&
                                        test.userGroups.forEach(userGroup =>
                                            expect(arr.userGroupAccesses).toContainEqual(userGroup)
                                        );
                                }
                            }
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
