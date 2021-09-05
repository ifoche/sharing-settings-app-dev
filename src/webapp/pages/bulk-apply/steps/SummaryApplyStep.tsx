import React, { useCallback } from "react";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
//import { useSnackbar } from "@eyeseetea/d2-ui-components";
import Button from "@material-ui/core/Button";
//import { useAppContext } from "../../../contexts/app-context";

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = ({
    sharingSettings,
    updateStrategy,
    selection,
    excluded,
}: MetadataSharingWizardStepProps) => {
    //const { compositionRoot } = useAppContext();
    //const snackbar = useSnackbar();

    const applySharingSync = useCallback(async () => {
        console.log(sharingSettings);
        console.log(updateStrategy);
        console.log(selection);
        console.log(excluded);
        const metadataWithOutExcluded = selection.filter(item => excluded.indexOf(item.id) === -1);
        console.log(metadataWithOutExcluded);
        /*compositionRoot.metadata.save(metadataWithOutExcluded).run(
            data => {
                console.log(data);
            },
            error => snackbar.error(error)
        );*/
    }, []);
    return (
        <Button variant="contained" color="primary" onClick={applySharingSync}>
            Apply Sharing Settings
        </Button>
    );
};
