import React, { useEffect, useState, useCallback } from "react"; //
import { useAppContext } from "../../../contexts/app-context";
import { ObjectsTable, TableSelection, TableState } from "@eyeseetea/d2-ui-components"; // TableState,
import i18n from "@dhis2/d2-i18n";
import _ from "lodash";
import { MetadataSharingWizardStepProps } from "./index";

//import { MetadataEntities } from "../../../../domain/entities/MetadataEntities";

//import { ListMetadataAllParams } from "../../../domain/repositories/MetadataRepository";
export const ListDependenciesStep: React.FC<MetadataSharingWizardStepProps> = ({
    metadata,
}: MetadataSharingWizardStepProps) => {
    console.log(metadata);
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
    const [metadataDependencies, setMetadataDependencies] = useState<any[]>([]);
    //const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selection, setSelection] = useState<TableSelection[]>([]);

    useEffect(() => {
        const getMetadataDependencies = async () => {
            //setIsLoading(true);
            /*
                1. figure out how to show child elements in the table
                2. and how to check and uncheck them individually
                3. how to call the API for each of the metadata
                4. how to have child elements
            */
            const { data } = await compositionRoot.metadata.list({ model: "dashboards", id: "Tinocd3QdaN" }).runAsync();
            //console.log(data);
            const { date, ...dataWithoutDate } = data;
            console.log(dataWithoutDate);
            //dataWithoutDate.dashboards[0]
            /*
            to show should be like:
            [
                { name: "dashboards", dashboards: [{}] },
                { name: "documents", documents: [{}] }
            ]
            */
            console.log(Object.entries(dataWithoutDate));
            const ff = Object.entries(dataWithoutDate).map(item => {
                const objToReturn = { name: item[0], id: item[0], [item[0]]: item[1] };
                return objToReturn;
            });
            console.log(ff);
            setMetadataDependencies(ff);
            //onChange(metadata => [...metadata, ...rows]);
            //setIsLoading(false);
        };
        getMetadataDependencies();
    }, [compositionRoot]);

    const onTableChange = useCallback(({ selection }: TableState<any>) => {
        console.log(selection);
        setSelection(selection);

        const selectionIds = selection.map((select: any) => select.id);
        console.log(metadataDependencies)
            const selectionsFullData = metadataDependencies.filter((meta: any) => selectionIds.includes(meta.id));
            console.log(selectionsFullData)
            //onChange([...metadata, ...selectionsFullData]);
    }, []);

    //externalAccess: item.externalAccess, publicAccess: item.publicAccess, id: item.id, name: item.name
    const columns = [
        { name: "name", text: i18n.t("Name"), sortable: true },
        { name: "id", text: i18n.t("ID"), sortable: true },
        { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
        { name: "externalAccess", text: i18n.t("External Access"), sortable: true },
    ];
    //loading={isLoading}
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
                childrenKeys={["dashboards", "documents"]}
            />
        </div>
    );
};
