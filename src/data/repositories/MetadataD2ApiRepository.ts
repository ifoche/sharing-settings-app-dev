import { Future, FutureData } from "../../domain/entities/Future";
import {
    MetadataRepository,
    ListAllMetadataParams,
    GetMetadataDependenciesOptions,
    Payload,
    MetadataObject,
    MetadataItem,
} from "../../domain/repositories/MetadataRepository";
import { getD2APiFromInstance } from "../../utils/d2-api";
import { apiToFuture } from "../../utils/futures";
import { Instance } from "../entities/Instance";
import { MetadataEntities } from "../../domain/entities/MetadataEntities";
import { Model, D2Api } from "../../types/d2-api";
import _ from "lodash";

export class MetadataD2ApiRepository implements MetadataRepository {
    private api: D2Api;

    constructor(instance: Instance) {
        this.api = getD2APiFromInstance(instance);
    }

    public listAllMetadata(options: ListAllMetadataParams): FutureData<MetadataObject> {
        const { model, page, pageSize, search, sorting = { field: "id", order: "asc" } } = options;

        //@ts-ignore: d2-api incorrectly guessing model with string access
        return apiToFuture(
            this.getApiModel(model).get({
                page,
                pageSize,
                paging: true,
                filter: { identifiable: search ? { token: search } : undefined },
                fields: { $owner: true },
                order: `${sorting.field}:${sorting.order}`,
            })
        );
    }

    public listMetadataWithDependencies(options: GetMetadataDependenciesOptions[]): FutureData<MetadataItem[]> {
        return Future.futureMap(options, item =>
            apiToFuture<Payload>(this.api.get(`/${item.model}/${item.id}/metadata.json`))
        ).map(data => {
            const mergedPayloads = this.mergePayloads(data);
            const dataWithIdsAndName = Object.entries(mergedPayloads).map(([key, value]) => {
                return value.map(item => ({ ...item, model: key }));
            });
            return _.flatten(dataWithIdsAndName);
        });
    }

    private getApiModel(type: keyof MetadataEntities): InstanceType<typeof Model> {
        return this.api.models[type];
    }

    private mergePayloads(payloads: Payload[]): Payload {
        return _.reduce(
            payloads,
            (result, payload) => {
                _.forOwn(payload, (value, key) => {
                    if (Array.isArray(value)) {
                        //@ts-ignore
                        const existing = result[key] ?? [];
                        //@ts-ignore
                        result[key] = _.uniqBy([...existing, ...value], ({ id }) => id);
                    }
                });
                return result;
            },
            {}
        );
    }
}
