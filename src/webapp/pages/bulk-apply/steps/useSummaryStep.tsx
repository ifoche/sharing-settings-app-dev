import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { SharingUpdate } from "../../../../domain/entities/SharingUpdate";
import { ImportResult } from "../../../../domain/entities/ImportResult";
import { SharingSummary } from "../../../../domain/entities/SharingSummary";

type GlobalMessage = {
    text: string;
    type: "success" | "error";
};

export function useSummaryStep(builder: SharingUpdate) {
    const { compositionRoot } = useAppContext();

    const [importResult, setImportResult] = useState<ImportResult>();
    const [openDialog, setDialogOpen] = useState<boolean>(false);
    const [sharingSummary, setSharingSummary] = useState<SharingSummary>();
    const [loading, setLoading] = useState<boolean>(false);
    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>(undefined);

    useEffect(() => {
        setLoading(true);
        compositionRoot.metadata.getSharingSummary(builder.baseElements).run(
            sharingSummary => {
                setSharingSummary(sharingSummary);
                setLoading(false);
            },
            error => setGlobalMessage({ type: "error", text: error })
        );
    }, [builder.baseElements, compositionRoot.metadata]);

    const applySharingSync = useCallback(() => {
        setLoading(true);
        compositionRoot.metadata
            .applySharingSettings(builder)
            .flatMap(payload => compositionRoot.metadata.import(payload))
            .run(
                result => {
                    openDialog && setDialogOpen(false);
                    setLoading(false);
                    setImportResult(result);
                },
                error => setGlobalMessage({ type: "error", text: error })
            );
    }, [builder, compositionRoot.metadata, openDialog]);

    const applySharingSettings = useCallback(() => {
        builder.sharings.publicAccess !== noAccess ? setDialogOpen(true) : applySharingSync();
    }, [applySharingSync, builder.sharings.publicAccess]);
    const closeImportSummary = useCallback(() => setImportResult(undefined), []);
    const closePublicAccessWarningDialog = useCallback(() => {
        setLoading(false);
        setDialogOpen(false);
    }, []);

    return {
        globalMessage,
        importResult,
        loading,
        openDialog,
        sharingSummary,
        applySharingSettings,
        applySharingSync,
        closeImportSummary,
        closePublicAccessWarningDialog,
    };
}

const noAccess = "--------";
