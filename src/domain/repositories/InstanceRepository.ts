import { FutureData } from "../entities/Future";
import { User } from "../entities/User";
import { UserSearch } from "../../data/entities/SearchUser";

export interface InstanceRepository {
    getBaseUrl(): string;
    getCurrentUser(): FutureData<User>;
    getInstanceVersion(): FutureData<string>;
    searchUsers(query: string): FutureData<UserSearch>;
}
