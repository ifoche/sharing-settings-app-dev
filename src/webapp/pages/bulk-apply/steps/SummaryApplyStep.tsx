import Button from "@material-ui/core/Button";
import React, { useCallback } from "react";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = () => {
    const applySharingSync = useCallback(async () => {}, []);

    return (
        <Button variant="contained" color="primary" onClick={applySharingSync}>
            Apply Sharing Settings
        </Button>
    );
};
