import { Instance } from "./data/entities/Instance";
import { InstanceDefaultRepository } from "./data/repositories/InstanceDefaultRepository";
import { MetadataD2ApiRepository } from "./data/repositories/MetadataD2ApiRepository";
import { ListMetadataUseCase } from "./domain/usecases/ListMetadataUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetInstanceVersionUseCase } from "./domain/usecases/GetInstanceVersionUseCase";
import { GetMetadataDependenciesUseCase } from "./domain/usecases/GetMetadataWithDependenciesUseCase";
import { SearchUsersUseCase } from "./domain/usecases/SearchUsersUseCase";

export function getCompositionRoot(instance: Instance) {
    const instanceRepository = new InstanceDefaultRepository(instance);
    const metadataRepository = new MetadataD2ApiRepository(instance);

    return {
        instance: getExecute({
            getCurrentUser: new GetCurrentUserUseCase(instanceRepository),
            getVersion: new GetInstanceVersionUseCase(instanceRepository),
            searchUsers: new SearchUsersUseCase(instanceRepository),
        }),
        metadata: getExecute({
            list: new ListMetadataUseCase(metadataRepository),
            getDependencies: new GetMetadataDependenciesUseCase(metadataRepository),
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
