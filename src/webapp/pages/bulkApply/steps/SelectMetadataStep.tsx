import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState } from "@eyeseetea/d2-ui-components"; // TableState,
import i18n from "@dhis2/d2-i18n";
import _ from "lodash";
import { MetadataSharingWizardStepProps } from "./index";
import Dropdown from "../../../components/dropdown/Dropdown";
//import { MetadataEntities } from "../../../../domain/entities/MetadataEntities";

import { ListAllMetadataParams } from "../../../../domain/repositories/MetadataRepository";
export const SelectMetadataStep: React.FC<MetadataSharingWizardStepProps> = ({
    onChange,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    const initialState = {
        sorting: {
            field: "displayName" as const,
            order: "asc" as const,
        },
        pagination: {
            page: 1,
            pageSize: 25,
        },
    };
    const [allMetadata, setAllMetadata] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);
    const [filters, setFilters] = useState<ListAllMetadataParams>({
        model: "dashboards",
        order: [initialState.sorting.field, initialState.sorting.order],
        page: initialState.pagination.page,
        pageSize: initialState.pagination.pageSize,
        search: "",
    });
    useEffect(() => {
        const getMetadata = async () => {
            setIsLoading(true);
            const {
                data: { objects: mdData },
            } = await compositionRoot.metadata.listAll(filters).runAsync();
            console.log(mdData);
            const rows = mdData.map((item: any) => ({
                ...item,
                //externalAccess: item.externalAccess.toString() || ,
            }));
            setAllMetadata(rows);
            //onChange(metadata => [...metadata, ...rows]);
            setIsLoading(false);
        };
        getMetadata();
    }, [filters, compositionRoot]);

    const onTableChange = useCallback(
        ({ selection }: TableState<any>, allMetadata) => {
            setSelection(selection);
            const selectionIds = selection.map((select: any) => select.id);
            const selectionsFullData = allMetadata.filter((meta: any) => selectionIds.includes(meta.id));
            onChange(selectionsFullData);
        },
        [onChange]
    );

    const updateFilters = useCallback(
        (partialFilters: Partial<ListAllMetadataParams>) => {
            setFilters(state => ({ ...state, page: 1, ...partialFilters }));
        },
        [setFilters]
    );
    //datasets programs and dashboards
    useEffect(() => {
        updateFilters({
            page: initialState.pagination.page,
        });
    }, [updateFilters]);

    const changeModelFilter = (modelName: string) => {
        updateFilters({
            ...filters,
            model: modelName,
        });
    };

    const filterComponents = (
        <React.Fragment key={"metadata-table-filters"}>
            <div>
                <Dropdown
                    items={[
                        { id: "dataSets", name: "dataSets" },
                        { id: "dashboards", name: "dashboards" },
                        { id: "programs", name: "programs" },
                    ]}
                    onValueChange={changeModelFilter}
                    value={filters.model}
                    label={i18n.t("Metadata type")}
                    hideEmpty={true}
                />
            </div>
        </React.Fragment>
    );
    const changeSearchFilter = (value: string) => {
        updateFilters({ search: value });
    };

    //externalAccess: item.externalAccess, publicAccess: item.publicAccess, id: item.id, name: item.name
    const columns = [
        { name: "name", text: i18n.t("Name"), sortable: true },
        { name: "id", text: i18n.t("ID"), sortable: true },
        { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
        //{ name: "externalAccess", text: i18n.t("External Access"), sortable: true },
    ];
    return (
        <div>
            <ObjectsTable<any>
                rows={allMetadata}
                columns={columns}
                onChange={selection => onTableChange(selection, allMetadata)}
                sorting={{ field: "position", order: "asc" }}
                loading={isLoading}
                initialState={initialState}
                selection={selection}
                forceSelectionColumn={true}
                filterComponents={filterComponents}
                onChangeSearch={changeSearchFilter}
                searchBoxLabel={i18n.t(`Search by name`)}
            />
        </div>
    );
};
