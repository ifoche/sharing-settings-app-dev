import {
    ObjectsTable,
    RowConfig,
    TableAction,
    TableColumn,
    TableSelection,
    TableState,
    useSnackbar,
} from "@eyeseetea/d2-ui-components";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MetadataItem } from "../../../../domain/entities/MetadataItem";
import { Ref } from "../../../../domain/entities/Ref";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";

export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({ builder, updateBuilder }) => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [rows, setRows] = useState<MetadataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    const columns = useMemo(
        (): TableColumn<MetadataItem>[] => [
            { name: "name", text: i18n.t("Name"), sortable: true },
            { name: "id", text: i18n.t("ID"), sortable: true },
            {
                name: "metadataType",
                text: i18n.t("Metadata Type"),
                sortable: false,
                getValue: (row: MetadataItem) => compositionRoot.metadata.getModelName(String(row.metadataType)),
            },
            { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
            { name: "userAccesses", text: i18n.t("Users"), sortable: true },
            { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
        ],
        [compositionRoot]
    );

    const actions = useMemo(
        (): TableAction<MetadataItem>[] => [
            {
                name: "exclude",
                text: i18n.t("Exclude dependency"),
                multiple: true,
                icon: <RemoveCircleOutlineIcon />,
                isActive: (rows: MetadataItem[]) => _.some(rows, row => !builder.excludedDependencies.includes(row.id)),
                onClick: (selection: string[]) => {
                    updateBuilder(builder => ({
                        ...builder,
                        excludedDependencies: _.uniq([...builder.excludedDependencies, ...selection]),
                    }));
                },
            },
            {
                name: "include",
                text: i18n.t("Include dependency"),
                multiple: true,
                icon: <AddCircleOutlineIcon />,
                isActive: (rows: MetadataItem[]) => _.every(rows, row => builder.excludedDependencies.includes(row.id)),
                onClick: (selection: string[]) => {
                    updateBuilder(builder => ({
                        ...builder,
                        excludedDependencies: _.difference(builder.excludedDependencies, selection),
                    }));
                },
            },
        ],
        [builder, updateBuilder]
    );

    const onTableChange = useCallback(({ selection }: TableState<Ref>) => setSelection(selection), [setSelection]);

    const rowConfig = useCallback(
        (row: MetadataItem): RowConfig => {
            const isExcluded = builder.excludedDependencies.includes(row.id);
            return isExcluded ? { style: { backgroundColor: "#ffcdd2" } } : {};
        },
        [builder]
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.metadata.listDependencies(builder.baseElements).run(
            data => {
                const rows = _(data)
                    .mapValues((value, key) => {
                        return value.map(item => ({ ...item, metadataType: key }));
                    })
                    .values()
                    .flatten()
                    .value();
                setRows(rows);
                setIsLoading(false);
            },
            error => snackbar.error(error)
        );
    }, [builder, compositionRoot, snackbar]);

    return (
        <div>
            <ObjectsTable<MetadataItem>
                rows={rows}
                columns={columns}
                sorting={{ field: "displayName", order: "asc" }}
                initialState={initialState}
                forceSelectionColumn={true}
                loading={isLoading}
                actions={actions}
                onChange={onTableChange}
                selection={selection}
                rowConfig={rowConfig}
            />
        </div>
    );
};

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
