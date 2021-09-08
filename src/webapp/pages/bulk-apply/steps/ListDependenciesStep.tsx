import { ObjectsTable, useSnackbar, TableSelection, TableState } from "@eyeseetea/d2-ui-components"; // TableSelection, TableState,
import _ from "lodash";
import React, { useEffect, useState, useMemo, useCallback } from "react"; //useCallback,
import { Ref } from "../../../../domain/entities/Ref";
import { MetadataItem } from "../../../../domain/repositories/MetadataRepository";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({ builder, updateBuilder }) => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [rows, setRows] = useState<MetadataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    const columns = useMemo(
        () => [
            { name: "name", text: i18n.t("Name"), sortable: true },
            { name: "id", text: i18n.t("ID"), sortable: true },
            { name: "metadataType", text: i18n.t("Metadata Type"), sortable: false },
            { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
            { name: "userAccesses", text: i18n.t("Users"), sortable: true },
            { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
        ],
        []
    );

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.metadata.getDependencies(builder.baseElements).run(
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

    const onTableChange = useCallback(({ selection }: TableState<Ref>) => setSelection(selection), [setSelection]);

    const tableActions = useMemo(
        () => [
            {
                name: "exclude",
                text: i18n.t("Exclude Metadata"),
                multiple: true,
                icon: <NotInterestedIcon />,
                onClick: (selection: string[]) => {
                    updateBuilder(builder => ({
                        ...builder,
                        excludedDependencies: _.uniq([...builder.excludedDependencies, ...selection]),
                    }));
                },
            },
        ],
        [updateBuilder]
    );

    return (
        <div>
            <ObjectsTable<MetadataItem>
                rows={rows}
                columns={columns}
                sorting={{ field: "displayName", order: "asc" }}
                initialState={initialState}
                forceSelectionColumn={true}
                loading={isLoading}
                actions={tableActions}
                onChange={onTableChange}
                selection={selection}
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
