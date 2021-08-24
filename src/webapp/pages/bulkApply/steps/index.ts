import { WizardStep } from "@eyeseetea/d2-ui-components";
import i18n from "../../../../locales";
import { ListDependenciesStep } from "./ListDependenciesStep";
import { SelectMetadataStep } from "./SelectMetadataStep";
import { AccessStep } from "./AccessStep";
import { SummaryApplyStep } from "./SummaryApplyStep";

export interface MetadataSharingWizardStep extends WizardStep {
    validationKeys: string[];
    props?: MetadataSharingWizardStepProps;
}

export interface MetadataSharingWizardStepProps {
    metadata: any;
    onChange: (update: any | ((prev: any) => any)) => void;
    onCancel: () => void;
}

export const columns = [
    { name: "name", text: i18n.t("Name"), sortable: true },
    { name: "id", text: i18n.t("ID"), sortable: true },
    { name: "publicAccess", text: i18n.t("Public Access"), sortable: true },
    { name: "userAccesses", text: i18n.t("Users"), sortable: true },
    { name: "userGroupAccesses", text: i18n.t("User Groups"), sortable: true },
];

export const initialState = {
    sorting: {
        field: "displayName" as const,
        order: "asc" as const,
    },
    pagination: {
        page: 1,
        pageSize: 25,
    },
};

export const metadataSharingWizardSteps: MetadataSharingWizardStep[] = [
    {
        key: "select-metadata",
        label: i18n.t("Select Metadata"),
        component: SelectMetadataStep,
        validationKeys: ["selection"],
        description: i18n.t("Select metadata to share"),
    },
    {
        key: "list-dependencies",
        label: i18n.t("List Dependencies and Exclude"),
        component: ListDependenciesStep,
        validationKeys: ["name"],
        description: i18n.t("List Dependencies and Exclude"),
    },
    {
        key: "sharing-access",
        label: i18n.t("Sharing Access"),
        component: AccessStep,
        validationKeys: ["name"],
        description: i18n.t("Sharing Access"),
    },
    {
        key: "summary-apply",
        label: i18n.t("Summary and Apply Metadata"),
        component: SummaryApplyStep,
        validationKeys: ["name"],
        description: i18n.t("List errors and warnings and apply metadata sharing"),
    },
];
