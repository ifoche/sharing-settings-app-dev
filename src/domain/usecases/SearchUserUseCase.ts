import { UseCase } from "../../CompositionRoot";
import { UserSearch } from "../../data/entities/SearchUser";
import { InstanceRepository } from "../repositories/InstanceRepository";

export class SearchUserUseCase implements UseCase {
    constructor(private instanceRepository: InstanceRepository) {}

    public execute(query: string): Promise<UserSearch> {
        return this.instanceRepository.searchUsers(query);
    }
}
