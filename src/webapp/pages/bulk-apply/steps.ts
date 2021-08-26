import { WizardStep } from "@eyeseetea/d2-ui-components";
import i18n from "../../../locales";
import { ListDependenciesStep } from "./steps/ListDependenciesStep";
import { SelectMetadataStep } from "./steps/SelectMetadataStep";
import { AccessStep } from "./steps/AccessStep";
import { SummaryApplyStep } from "./steps/SummaryApplyStep";

export interface MetadataSharingWizardStep extends WizardStep {
    validationKeys: string[];
    props?: MetadataSharingWizardStepProps;
}

export interface MetadataSharingWizardStepProps {
    metadata: any;
    onChange: (update: any | ((prev: any) => any)) => void;
    onCancel: () => void;
}

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
