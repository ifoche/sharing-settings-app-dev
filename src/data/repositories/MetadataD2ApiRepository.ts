import { D2Api } from "@eyeseetea/d2-api/2.34";
import { Future, FutureData } from "../../domain/entities/Future";
import { MetadataRepository } from "../../domain/repositories/MetadataRepository";
import { getD2APiFromInstance } from "../../utils/d2-api";
import { apiToFuture } from "../../utils/futures";
import { Instance } from "../entities/Instance";
import { MetadataEntities } from "../../domain/entities/MetadataEntities";
import { Model } from "../../types/d2-api";
import _ from "lodash";

export class MetadataD2ApiRepository implements MetadataRepository {
    private api: D2Api;

    constructor(instance: Instance) {
        this.api = getD2APiFromInstance(instance);
    }

    public listAllMetadata(options: {
        model: "dataSets" | "programs" | "dashboards";
        page?: number;
        pageSize?: number;
        search?: string;
        order?: [string, string];
    }): FutureData<any> {
        const { model, page, pageSize, search, order } = options;
        const [field, orderBy] = order ?? ["name", "asc"];
        //@ts-ignore: d2-api incorrectly guessing model with string access
        return apiToFuture(
            this.getApiModel(model).get({
                page,
                pageSize,
                paging: true,
                filter: { identifiable: search ? { token: search } : undefined },
                fields: { $owner: true },
                order: `${field}:${orderBy}`,
            })
        );
    }
    //with dependencies
    public listMetadataWithDependencies(options: [{ model: "dataSets" | "programs" | "dashboards"; id: string }]): FutureData<any> {
        return Future.futureMap(options, item =>
            apiToFuture(this.api.get(`/${item.model}/${item.id}/metadata.json`))
        ).map(data => {
            const dataWithoutDate = data.map((dataItem: any) => {
                    const { date, ...everythingElse } = dataItem; // eslint-disable-line
                    return everythingElse;
                })
            const mergedData = this.mergePayloads(dataWithoutDate)
            return mergedData
        });
    }
   
    private getApiModel(type: keyof MetadataEntities): InstanceType<typeof Model> {
        return this.api.models[type];
    }

    private mergePayloads(payloads: Record<string, any[]>[]): Record<string, any[]> {
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
