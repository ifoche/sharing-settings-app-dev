import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState } from "@eyeseetea/d2-ui-components";
import i18n from "@dhis2/d2-i18n";

import { MetadataSharingWizardStepProps, columns, initialState } from "./index";
import Dropdown from "../../../components/dropdown/Dropdown";
import { Ref } from "../../../../domain/entities/Ref";
import { ListAllMetadataParams } from "../../../../domain/repositories/MetadataRepository";

export const SelectMetadataStep: React.FC<MetadataSharingWizardStepProps> = ({
    onChange,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    const [allMetadata, setAllMetadata] = useState<Record<string, any>[]>([]);
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
            const rows = mdData.map((item: any) => ({
                ...item,
                model: filters.model,
            }));
            setAllMetadata(rows);
            setIsLoading(false);
        };
        getMetadata();
    }, [filters, compositionRoot]);

    const onTableChange = useCallback(
        ({ selection }: TableState<Ref>, allMetadata) => {
            setSelection(selection);
            const selectionIds = selection.map((select: Ref) => select.id);
            const selectionsFullData = allMetadata.filter((meta: Record<string, any>) => selectionIds.includes(meta.id));
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
