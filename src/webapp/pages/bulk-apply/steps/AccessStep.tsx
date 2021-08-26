import { ShareUpdate, Sharing, SharingRule } from "@eyeseetea/d2-ui-components";
import React, { useCallback } from "react";
import { SharingSetting } from "../../../../domain/entities/Ref";
import { useAppContext } from "../../../contexts/app-context";
import { MetadataSharingWizardStepProps } from "../steps";

export const AccessStep: React.FC<MetadataSharingWizardStepProps> = ({
    metadata,
    onChange,
}: MetadataSharingWizardStepProps) => {
    const { compositionRoot } = useAppContext();

    const search = useCallback(
        (query: string) => compositionRoot.instance.searchUsers(query).toPromise(),
        [compositionRoot]
    );

    const setModuleSharing = useCallback(
        async ({ publicAccess, userAccesses, userGroupAccesses }: ShareUpdate) => {
            onChange((metadata: any) => {
                return {
                    ...metadata,
                    publicAccess: publicAccess ?? metadata.publicAccess,
                    userAccesses: userAccesses ? mapSharingSettings(userAccesses) : metadata.userAccesses,
                    userGroupAccesses: userGroupAccesses
                        ? mapSharingSettings(userGroupAccesses)
                        : metadata.userGroupAccesses,
                };
            });
        },
        [onChange]
    );

    return (
        <React.Fragment>
            <Sharing
                meta={{
                    meta: { allowPublicAccess: true, allowExternalAccess: false },
                    object: {
                        id: module.id,
                        displayName: metadata.name,
                        publicAccess: metadata.publicAccess,
                        userAccesses: mapSharingRules(metadata.userAccesses),
                        userGroupAccesses: mapSharingRules(metadata.userGroupAccesses),
                    },
                }}
                showOptions={{
                    title: false,
                    dataSharing: false,
                    publicSharing: true,
                    externalSharing: false,
                    permissionPicker: true,
                }}
                onSearch={search}
                onChange={setModuleSharing}
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
