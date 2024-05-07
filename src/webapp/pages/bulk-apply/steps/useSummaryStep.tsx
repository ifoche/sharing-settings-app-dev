import { useCallback, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { SharingUpdate } from "../../../../domain/entities/SharingUpdate";
import { ImportResult } from "../../../../domain/entities/ImportResult";
import { MetadataSharing } from "../../../../domain/entities/MetadataSharing";
import _ from "lodash";

type GlobalMessage = {
    text: string;
    type: "success" | "error";
};

export function useSummaryStep(builder: SharingUpdate) {
    const { compositionRoot } = useAppContext();

    const [importResult, setImportResult] = useState<ImportResult>();
    const [openDialog, setDialogOpen] = useState<boolean>(false);
    const [openWarningsDialog, setWarningsDialogOpen] = useState<boolean>(false);
    const [warningResult, setWarningResult] = useState<MetadataSharing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>(undefined);

    const applySharingSync = useCallback(() => {
        setLoading(true);

        compositionRoot.metadata
            .applySharingSettings(builder)
            .flatMap(payload => compositionRoot.metadata.import(payload))
            .run(
                result => {
                    openDialog && setDialogOpen(false);
                    openWarningsDialog && setWarningsDialogOpen(false);
                    setLoading(false);
                    setImportResult(result);
                },
                error => setGlobalMessage({ type: "error", text: error })
            );
    }, [builder, compositionRoot.metadata, openDialog, openWarningsDialog]);

    const getMetadataSharingWithChildren = useCallback(() => {
        setLoading(true);

        compositionRoot.metadata.getMetadataWithChildrenSharings(builder.baseElements).run(
            result => {
                if (!_.isEmpty(result)) {
                    setWarningsDialogOpen(true);
                    setWarningResult(result);
                    setLoading(false);
                } else {
                    applySharingSync();
                }
            },
            error => setGlobalMessage({ type: "error", text: error })
        );
    }, [applySharingSync, builder.baseElements, compositionRoot.metadata]);

    const applySharingSettings = useCallback(() => {
        builder.sharings.publicAccess !== "--------" ? setDialogOpen(true) : getMetadataSharingWithChildren();
    }, [builder.sharings.publicAccess, getMetadataSharingWithChildren]);
    const closeImportSummary = useCallback(() => setImportResult(undefined), []);
    const closePublicAccessWarningDialog = useCallback(() => {
        setLoading(false);
        setDialogOpen(false);
    }, []);
    const closeWarningDialog = useCallback(() => {
        setLoading(false);
        setWarningResult([]);
        setWarningsDialogOpen(false);
    }, []);

    return {
        globalMessage,
        importResult,
        loading,
        openDialog,
        openWarningsDialog,
        warningResult,
        applySharingSync,
        applySharingSettings,
        closeImportSummary,
        closePublicAccessWarningDialog,
        closeWarningDialog,
        getMetadataSharingWithChildren,
    };
}
