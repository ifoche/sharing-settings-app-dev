import { Instance } from "./data/entities/Instance";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { MetadataD2ApiRepository } from "./data/repositories/MetadataD2ApiRepository";

import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { SearchUserUseCase } from "./domain/usecases/SearchUserUseCase";

import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetAllMetadataUseCase } from "./domain/usecases/GetAllMetadataUseCase";
import { GetMetadataWithDependenciesUseCase } from "./domain/usecases/GetMetadataWithDependenciesUseCase";

export function getCompositionRoot(instance: Instance) {
    const instanceRepository = new InstanceDefaultRepository(instance);
    const metadataRepository = new MetadataD2ApiRepository(instance);

    return {
        instance: getExecute({
            getCurrentUser: new GetCurrentUserUseCase(instanceRepository),
            getVersion: new GetInstanceVersionUseCase(instanceRepository),
            searchUsers: new SearchUserUseCase(instanceRepository),
        }),
        metadata: getExecute({
            listAll: new GetAllMetadataUseCase(metadataRepository),
            list: new GetMetadataWithDependenciesUseCase(metadataRepository),
        }),
    };
}

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}

export interface UseCase {
    execute: Function;
}
