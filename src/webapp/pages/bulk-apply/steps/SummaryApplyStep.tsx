import { ConfirmationDialog, useSnackbar } from "@eyeseetea/d2-ui-components";
import Button from "@material-ui/core/Button";
import React, { useCallback, useState } from "react";
import { ImportResult } from "../../../../domain/entities/ImportResult";
import i18n from "../../../../locales";
import { ImportSummary } from "../../../components/import-summary/ImportSummary";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = ({ builder }) => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [importResult, setImportResult] = useState<ImportResult>();
    const [openDialog, setDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

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
                error => snackbar.error(error)
            );
    }, [builder, compositionRoot.metadata, openDialog, snackbar]);

    return (
        <React.Fragment>
            {importResult && <ImportSummary results={[importResult]} onClose={() => setImportResult(undefined)} />}

            <ConfirmationDialog
                isOpen={openDialog}
                title={i18n.t("Warning")}
                onCancel={() => {
                    setLoading(false);
                    setDialogOpen(false);
                }}
                onSave={applySharingSync}
                saveText={loading ? i18n.t("Saving") : i18n.t("Continue")}
                cancelText={i18n.t("Go back")}
                maxWidth={"sm"}
                fullWidth={true}
                disableSave={loading}
            >
                You are about to change the public access sharing setting. Would you like to continue?
            </ConfirmationDialog>

            <Button
                variant="contained"
                color="primary"
                onClick={() => (builder.sharings.publicAccess !== "--------" ? setDialogOpen(true) : applySharingSync)}
            >
                Apply Sharing Settings
            </Button>
        </React.Fragment>
    );
};
