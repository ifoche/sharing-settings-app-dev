import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import { MetadataSharingWizardStepProps } from "../steps";
import { Ref } from "../../../../domain/entities/Ref";
import i18n from "../../../../locales";
import { MetadataItem } from "../../../../domain/repositories/MetadataRepository";

export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({
    metadata,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    const [metadataDependencies, setMetadataDependencies] = useState<MetadataItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    const columns = [
        { name: "name", text: i18n.t("Name"), sortable: true },
        { name: "id", text: i18n.t("ID"), sortable: true },
        { name: "model", text: i18n.t("Metadata Type"), sortable: false },
        { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
        { name: "userAccesses", text: i18n.t("Users"), sortable: true },
        { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
    ];

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
        const getMetadataDependencies = async () => {
            setIsLoading(true);
            const { data = [] } = await compositionRoot.metadata.getDependencies(metadata).runAsync();
            setMetadataDependencies(data);
            setIsLoading(false);
        };
        getMetadataDependencies();
    }, [metadata, compositionRoot]);

    const onTableChange = useCallback(({ selection }: TableState<Ref>) => {
        setSelection(selection);
    }, []);

    return (
        <div>
            <ObjectsTable<MetadataItem>
                rows={metadataDependencies}
                columns={columns}
                onChange={onTableChange}
                sorting={{ field: "displayName", order: "asc" }}
                initialState={initialState}
                selection={selection}
                forceSelectionColumn={true}
                loading={isLoading}
            />
        </div>
    );
};
