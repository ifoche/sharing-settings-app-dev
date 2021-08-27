import _ from "lodash";
import { Future, FutureData } from "../../domain/entities/Future";
import {
    GetDependenciesItem,
    ListMetadataResponse,
    ListOptions,
    MetadataPayload,
    MetadataRepository,
} from "../../domain/repositories/MetadataRepository";
import { D2Api } from "../../types/d2-api";
import { getD2APiFromInstance } from "../../utils/d2-api";
import { apiToFuture } from "../../utils/futures";
import { Instance } from "../entities/Instance";

export class MetadataD2ApiRepository implements MetadataRepository {
    private api: D2Api;

    constructor(instance: Instance) {
        this.api = getD2APiFromInstance(instance);
    }

    public list(options: ListOptions): FutureData<ListMetadataResponse> {
        const { model, page, pageSize, search, sorting = { field: "id", order: "asc" } } = options;

        return apiToFuture(
            //@ts-ignore: d2-api incorrectly guessing model with string access
            this.api.models[model].get({
                page,
                pageSize,
                paging: true,
                filter: { identifiable: search ? { token: search } : undefined },
                fields: { $owner: true },
                order: `${sorting.field}:${sorting.order}`,
            })
        );
    }

    public getDependencies(options: GetDependenciesItem[]): FutureData<MetadataPayload> {
        return Future.futureMap(options, item =>
            apiToFuture<MetadataPayload>(this.api.get(`/${item.model}/${item.id}/metadata.json`))
        ).map(data => this.mergePayloads(data));
    }

    private mergePayloads(payloads: MetadataPayload[]): MetadataPayload {
        return _.reduce(
            payloads,
            (result, payload) => {
                _.forOwn(payload, (value, key) => {
                    if (Array.isArray(value)) {
                        const existing = result[key] ?? [];
                        result[key] = _.uniqBy([...existing, ...value], ({ id }) => id);
                    }
                });
                return result;
            },
            {} as MetadataPayload
        );
    }
}
