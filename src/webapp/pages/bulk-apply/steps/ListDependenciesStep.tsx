import { ObjectsTable, useSnackbar, TableSelection, TableState } from "@eyeseetea/d2-ui-components"; // TableSelection, TableState,
import _ from "lodash";
import React, { useEffect, useState, useMemo, useCallback } from "react"; //useCallback,
import { Ref } from "../../../../domain/entities/Ref";
import { MetadataItem } from "../../../../domain/repositories/MetadataRepository";
import i18n from "../../../../locales";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({
    selection: metadata,
    changeSelection: onChange,
    setExcluded,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [metadataDependencies, setMetadataDependencies] = useState<MetadataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    const columns = useMemo(
        () => [
            { name: "name", text: i18n.t("Name"), sortable: true },
            { name: "id", text: i18n.t("ID"), sortable: true },
            { name: "model", text: i18n.t("Metadata Type"), sortable: false },

            { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
            { name: "userAccesses", text: i18n.t("Users"), sortable: true },
            { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
        ],
        []
    );

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

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.metadata.getDependencies(metadata.map(({ id }) => id)).run(
            data => {
                const dataWithIdsAndName = Object.entries(data).map(([key, value]) => {
                    return value.map(item => ({ ...item, model: key }));
                });
                onChange(_.flatten(dataWithIdsAndName));
                setMetadataDependencies(_.flatten(dataWithIdsAndName));
                setIsLoading(false);
            },
            error => snackbar.error(error)
        );
    }, [onChange, compositionRoot, snackbar]);

    const onTableChange = useCallback(
        ({ selection }: TableState<Ref>) => {
            setSelection(selection);
        },
        [setSelection]
    );

    const excludeMetadata = (selectedMDs: string[]) => {
        setExcluded(metadata => [...new Set(metadata.concat(selectedMDs))]);
    };

    const tableActions = [
        {
            name: "exclude",
            text: i18n.t("Exclude Metadata"),
            multiple: true,
            onClick: excludeMetadata,
            icon: <NotInterestedIcon />,
        },
    ];

    return (
        <div>
            <ObjectsTable<MetadataItem>
                rows={metadataDependencies}
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
