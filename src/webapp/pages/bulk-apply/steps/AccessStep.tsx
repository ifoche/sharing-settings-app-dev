import { ShareUpdate, Sharing, SharingRule } from "@eyeseetea/d2-ui-components";
import React, { useCallback, useState } from "react";
import { SharingSetting } from "../../../../domain/entities/SharedObject";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../SharingWizardSteps";
import { Switch, FormControlLabel } from "@material-ui/core";
import i18n from "@dhis2/d2-i18n";

export const AccessStep: React.FC<MetadataSharingWizardStepProps> = ({
    sharingSettings,
    changeSharingSettings,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();
    const [updateStrategy, setUpdateStrategy] = useState<string>("Replace");

    const search = useCallback(
        (query: string) => compositionRoot.instance.searchUsers(query).toPromise(),
        [compositionRoot]
    );
    const label = i18n.t("Update strategy:") + " "+i18n.t(updateStrategy)
    const setModuleSharing = useCallback(
        async ({ publicAccess, userAccesses, userGroupAccesses }: ShareUpdate) => {
            changeSharingSettings(metadata => ({
                publicAccess: publicAccess ?? metadata.publicAccess,
                userAccesses: mapSharingSettings(userAccesses) ?? metadata.userAccesses,
                userGroupAccesses: mapSharingSettings(userGroupAccesses) ?? metadata.userGroupAccesses,
            }));
        },
        [changeSharingSettings]
    );

    return (
        <React.Fragment>
            <Sharing
                showOptions={showOptions}
                onSearch={search}
                onChange={setModuleSharing}
                meta={{
                    meta: { allowPublicAccess: true, allowExternalAccess: false },
                    object: {
                        id: "meta-object",
                        displayName: "Sharing settings",
                        publicAccess: sharingSettings.publicAccess,
                        userAccesses: mapSharingRules(sharingSettings.userAccesses),
                        userGroupAccesses: mapSharingRules(sharingSettings.userGroupAccesses),
                    },
                }}
            />
            <h4>Advanced options</h4>
            <FormControlLabel
        control={
          <Switch
                name="updateStrategy"
                checked={updateStrategy === "Replace"}
                onChange={() =>
                    setUpdateStrategy(strategy => strategy === "Merge" ? "Replace" : "Merge")
                }
                color="primary"
            />
        }
        label={label}
      />
        </React.Fragment>
    );
};

const mapSharingSettings = (settings?: SharingRule[]): SharingSetting[] | undefined => {
    return settings?.map(item => {
        return { id: item.id, access: item.access, name: item.displayName };
    });
};

const mapSharingRules = (settings?: SharingSetting[]): SharingRule[] | undefined => {
    return settings?.map(item => {
        return { id: item.id, access: item.access, displayName: item.name };
    });
};

const showOptions = {
    title: false,
    dataSharing: false,
    publicSharing: true,
    externalSharing: false,
    permissionPicker: true,
};
