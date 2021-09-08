import _ from "lodash";
import { Future, FutureData } from "../../domain/entities/Future";
import {
    isValidModel,
    ListMetadataResponse,
    ListOptions,
    MetadataModel,
    MetadataPayload,
    MetadataRepository,
} from "../../domain/repositories/MetadataRepository";
import { MetadataResponse, D2Api } from "../../types/d2-api";
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

    public save(payload: MetadataPayload): FutureData<MetadataResponse> {
        return apiToFuture(this.api.metadata.post(payload));
    }

    public getDependencies(ids: string[]): FutureData<MetadataPayload> {
        return this.fetchMetadata(ids)
            .flatMap(payload => {
                const items = _(payload)
                    .mapValues((items, key) => {
                        if (!Array.isArray(items) || !isValidModel(key)) return undefined;
                        return items.map(item => ({ model: key, id: item.id }));
                    })
                    .values()
                    .flatten()
                    .compact()
                    .value();

                return Future.futureMap(items, ({ model, id }) => this.fetchMetadataWithDependencies(model, id));
            })
            .map(data => this.mergePayloads(data));
    }

    private fetchMetadata(ids: string[]): FutureData<MetadataPayload> {
        return apiToFuture(this.api.get("/metadata", { filter: `id:in:[${ids.join(",")}]` }));
    }

    private fetchMetadataWithDependencies(model: MetadataModel, id: string): FutureData<MetadataPayload> {
        return apiToFuture<MetadataPayload>(this.api.get(`/${model}/${id}/metadata.json`));
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
