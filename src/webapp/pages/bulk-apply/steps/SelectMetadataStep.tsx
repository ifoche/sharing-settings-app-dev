import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState, TablePagination } from "@eyeseetea/d2-ui-components";
import i18n from "@dhis2/d2-i18n";

import { MetadataSharingWizardStepProps } from "../steps";
import Dropdown from "../../../components/dropdown/Dropdown";
import { GetMetadataModel, MetadataItem } from "../../../../domain/repositories/MetadataRepository";

export const SelectMetadataStep: React.FC<MetadataSharingWizardStepProps> = ({
    metadata,
    onChange,
}: MetadataSharingWizardStepProps) => {
    const initialState = {
        sorting: { field: "displayName" as const, order: "asc" as const },
        pagination: { page: 1, pageSize: 25 },
    };
    const { compositionRoot } = useAppContext();
    const [allMetadata, setAllMetadata] = useState<{
        objects: MetadataItem[];
        pager: Partial<TablePagination>;
    }>({ objects: [], pager: initialState.pagination });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>(metadata ?? []);
    const [model, setModel] = useState<GetMetadataModel>("dashboards");
    const [search, setSearch] = useState<string>("");

    const columns = [
        { name: "name", text: i18n.t("Name"), sortable: true },
        { name: "id", text: i18n.t("ID"), sortable: true },
        { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
        { name: "userAccesses", text: i18n.t("Users"), sortable: true },
        { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
    ];
    useEffect(() => onChange(selection), [onChange, selection]);
    useEffect(() => {
        const getMetadata = async () => {
            setIsLoading(true);
            const { data } = await compositionRoot.metadata.listAll({ ...initialState, model, search }).runAsync();
            if (data) {
                const rows = data.objects.map((item: MetadataItem) => ({
                    ...item,
                    model,
                }));
                setAllMetadata({ objects: rows, pager: data.pager });
                setIsLoading(false);
            }
        };
        getMetadata();
    }, [compositionRoot.metadata, search, model]);

    const onTableChange = useCallback(
        async (tableState: TableState<MetadataItem>, model) => {
            setIsLoading(true);
            setAllMetadata({ objects: [], pager: {} });
            setSelection(oldSelection => {
                const selection = tableState?.selection ?? oldSelection;
                return selection.map((select: any) => (!select.model ? { id: select.id, model } : select));
            });

            const { pagination, sorting } = tableState ?? initialState;
            const { data } = await compositionRoot.metadata
                .listAll({
                    pageSize: pagination.pageSize,
                    page: pagination.page,
                    sorting: { field: sorting.field.toString(), order: sorting.order },
                    search,
                    model,
                })
                .runAsync();
            if (data) {
                setAllMetadata({ objects: data?.objects, pager: data?.pager });
            }
            setIsLoading(false);
        },
        [search, compositionRoot, model]
    );

    const changeModelFilter = (modelName: GetMetadataModel) => {
        setModel(modelName);
    };

    const filterComponents = (
        <React.Fragment key={"metadata-table-filters"}>
            <div>
                <Dropdown
                    items={[
                        { id: "dataSets", name: i18n.t("Data Sets") },
                        { id: "dashboards", name: i18n.t("Dashboards") },
                        { id: "programs", name: i18n.t("Programs") },
                    ]}
                    onValueChange={changeModelFilter}
                    value={model}
                    label={i18n.t("Metadata type")}
                    hideEmpty={true}
                />
            </div>
        </React.Fragment>
    );

    return (
        <div>
            <ObjectsTable<MetadataItem>
                rows={allMetadata.objects}
                columns={columns}
                onChange={tableState => onTableChange(tableState, model)}
                pagination={allMetadata.pager}
                sorting={{ field: "displayName", order: "asc" }}
                loading={isLoading}
                initialState={initialState}
                selection={selection}
                forceSelectionColumn={true}
                filterComponents={filterComponents}
                onChangeSearch={setSearch}
                searchBoxLabel={i18n.t(`Search by name`)}
            />
        </div>
    );
};
