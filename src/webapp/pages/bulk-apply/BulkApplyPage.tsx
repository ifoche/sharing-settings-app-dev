import React, { useState, useCallback } from "react";
import { SharingWizard } from "./SharingWizard";
import { ConfirmationDialog, ConfirmationDialogProps } from "@eyeseetea/d2-ui-components";
import i18n from "@dhis2/d2-i18n";
import { PageHeader } from "../../components/page-header/PageHeader";
import { useGoBack } from "../../hooks/useGoBack";

export const BulkApplyPage: React.FC = () => {
    const goBack = useGoBack();

    const [metadata, setMetadata] = useState<Record<string, any>[]>();
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);

    const onCancel = useCallback(() => {
        updateDialog({
            title: i18n.t("Cancel sharing action?"),
            description: i18n.t("All your changes will be lost. Are you sure you want to proceed?"),
            saveText: i18n.t("Yes"),
            cancelText: i18n.t("No"),
            onSave: () => null,
            onCancel: () => updateDialog(null),
        });
    }, []);

    return (
        <React.Fragment>
            <PageHeader title={i18n.t("Bulk apply")} onBackClick={goBack} />

            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}
            <SharingWizard onChange={update => setMetadata(update)} onCancel={onCancel} metadata={metadata} />;
        </React.Fragment>
    );
};
