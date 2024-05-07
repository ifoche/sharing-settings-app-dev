import { ConfirmationDialog, useSnackbar } from "@eyeseetea/d2-ui-components";
import Button from "@material-ui/core/Button";
import React, { useEffect } from "react";
import i18n from "../../../../locales";
import { ImportSummary } from "../../../components/import-summary/ImportSummary";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
import { useSummaryStep } from "./useSummaryStep";

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = ({ builder }) => {
    const snackbar = useSnackbar();

    const {
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
    } = useSummaryStep(builder);

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage.type === "error") {
            snackbar.error(globalMessage.text);
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    return (
        <React.Fragment>
            {importResult && <ImportSummary results={[importResult]} onClose={closeImportSummary} />}

            <ConfirmationDialog
                isOpen={openDialog}
                title={i18n.t("Warning")}
                onCancel={closePublicAccessWarningDialog}
                onSave={getMetadataSharingWithChildren}
                saveText={loading ? i18n.t("Saving") : i18n.t("Continue")}
                cancelText={i18n.t("Go back")}
                maxWidth={"sm"}
                fullWidth={true}
                disableSave={loading}
            >
                {i18n.t("You are about to change the public access sharing setting. Would you like to continue?")}
            </ConfirmationDialog>

            <ConfirmationDialog
                isOpen={openWarningsDialog}
                title={i18n.t("Warning")}
                onCancel={closeWarningDialog}
                onSave={applySharingSync}
                saveText={loading ? i18n.t("Saving") : i18n.t("Continue")}
                cancelText={i18n.t("Go back")}
                maxWidth={"lg"}
                fullWidth={true}
                disableSave={loading}
            >
                {warningResult.map(item => {
                    return (
                        <ul key={item.id}>
                            <li>
                                {i18n.t(`${item.name} (${item.id}) has different sharing settings from:`)}
                                <ul>
                                    {item.children.map(child => {
                                        return <li key={child.id}>{i18n.t(`${child.name} (${child.id})`)}</li>;
                                    })}
                                </ul>
                            </li>
                        </ul>
                    );
                })}
            </ConfirmationDialog>

            <Button variant="contained" color="primary" onClick={applySharingSettings} disabled={loading}>
                {i18n.t("Apply Sharing Settings")}
            </Button>
        </React.Fragment>
    );
};
