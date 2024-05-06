import { ConfirmationDialog, useSnackbar } from "@eyeseetea/d2-ui-components";
import Button from "@material-ui/core/Button";
import React, { useCallback, useState } from "react";
import { ImportResult } from "../../../../domain/entities/ImportResult";
import i18n from "../../../../locales";
import { ImportSummary } from "../../../components/import-summary/ImportSummary";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
import _ from "lodash";
import { MetadataSharing } from "../../../../domain/entities/MetadataSharing";

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = ({ builder }) => {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();

    const [importResult, setImportResult] = useState<ImportResult>();
    const [openDialog, setDialogOpen] = useState<boolean>(false);
    const [openWarningsDialog, setWarningsDialogOpen] = useState<boolean>(false);
    const [warningResult, setWarningResult] = useState<MetadataSharing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const applySharingSetting = useCallback(() => {
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
                error => snackbar.error(error)
            );
    }, [builder, compositionRoot.metadata, openDialog, openWarningsDialog, snackbar]);

    const applySharingSync = useCallback(() => {
        setLoading(true);

        compositionRoot.metadata.getMetadataWithChildrenSharings(builder.baseElements).run(
            result => {
                if (!_.isEmpty(result)) {
                    setWarningsDialogOpen(true);
                    setWarningResult(result);
                    setLoading(false);
                } else {
                    applySharingSetting();
                }
            },
            error => snackbar.error(error)
        );
    }, [applySharingSetting, builder.baseElements, compositionRoot.metadata, snackbar]);

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
                {i18n.t("You are about to change the public access sharing setting. Would you like to continue?")}
            </ConfirmationDialog>

            <ConfirmationDialog
                isOpen={openWarningsDialog}
                title={i18n.t("Warning")}
                onCancel={() => {
                    setLoading(false);
                    setWarningResult([]);
                    setWarningsDialogOpen(false);
                }}
                onSave={applySharingSetting}
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
                                    {item.children.map((child: any) => {
                                        return <li key={child.id}>{i18n.t(`${child.name} (${child.id})`)}</li>;
                                    })}
                                </ul>
                            </li>
                        </ul>
                    );
                })}
            </ConfirmationDialog>

            <Button
                variant="contained"
                color="primary"
                onClick={() =>
                    builder.sharings.publicAccess !== "--------" ? setDialogOpen(true) : applySharingSync()
                }
                disabled={loading}
            >
                {i18n.t("Apply Sharing Settings")}
            </Button>
        </React.Fragment>
    );
};
