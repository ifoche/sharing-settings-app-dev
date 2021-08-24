import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState } from "@eyeseetea/d2-ui-components";
import _ from "lodash";
import { MetadataSharingWizardStepProps, columns, initialState } from "./index";
import { Ref } from "../../../../domain/entities/Ref";

export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({
    metadata,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    
    const [metadataDependencies, setMetadataDependencies] = useState<Record<string, any>[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    useEffect(() => {
        const getMetadataDependencies = async () => {
            setIsLoading(true);
            const modelIdToSend = metadata.map((metaItem: Record<string, any>) => ({ model: metaItem.model, id: metaItem.id }));
            const { data } = await compositionRoot.metadata.list(modelIdToSend).runAsync();
            const dataWithIdsAndName = Object.entries(data).map(item => {
                const objToReturn = { name: item[0], id: item[0], [item[0]]: item[1] };
                return objToReturn;
            });
            setMetadataDependencies(dataWithIdsAndName);
            setIsLoading(false);
        };
        getMetadataDependencies();
    }, [metadata, compositionRoot]);

    const onTableChange = useCallback(({ selection }: TableState<Ref>) => {
        setSelection(selection);
    }, []);

    return (
        <div>
            <ObjectsTable<any>
                rows={metadataDependencies}
                columns={columns}
                onChange={onTableChange}
                sorting={{ field: "position", order: "asc" }}
                initialState={initialState}
                selection={selection}
                forceSelectionColumn={true}
                childrenKeys={["dashboards", "documents", "reports", "dataSets", "programs"]}
                loading={isLoading}
            />
        </div>
    );
};
