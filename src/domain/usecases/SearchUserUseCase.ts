import { UseCase } from "../../CompositionRoot";
import { UserSearch } from "../../data/entities/SearchUser";
import { InstanceRepository } from "../repositories/InstanceRepository";
import { FutureData } from "../../domain/entities/Future";

export class SearchUserUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public execute(query: string): FutureData<UserSearch> {
        return this.instanceRepository.searchUsers(query);
    }
}
