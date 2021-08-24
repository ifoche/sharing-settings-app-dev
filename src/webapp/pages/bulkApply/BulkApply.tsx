import React, { useState, useCallback } from "react";
import { SharingWizard } from "./SharingWizard";
import { ConfirmationDialog, ConfirmationDialogProps } from "@eyeseetea/d2-ui-components";
import i18n from "@dhis2/d2-i18n";

export const BulkApply: React.FC = () => {
    const [metadata, setMetadata] = useState<Record<string, any>[]>();
    const [dialogProps, updateDialog] = useState<ConfirmationDialogProps | null>(null);

    const onChange = useCallback((update: Parameters<typeof setMetadata>[0]) => {
        setMetadata(update);
    }, []);

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
        <>
            {dialogProps && <ConfirmationDialog isOpen={true} maxWidth={"xl"} {...dialogProps} />}
            <SharingWizard onChange={onChange} onCancel={onCancel} metadata={metadata} />;
        </>
    );
};
