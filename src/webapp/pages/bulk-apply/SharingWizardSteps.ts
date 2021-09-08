import { WizardStep } from "@eyeseetea/d2-ui-components";
import i18n from "../../../locales";
import { ListDependenciesStep } from "./steps/ListDependenciesStep";
import { SelectMetadataStep } from "./steps/SelectMetadataStep";
import { AccessStep } from "./steps/AccessStep";
import { SummaryApplyStep } from "./steps/SummaryApplyStep";
import { Ref } from "../../../domain/entities/Ref";
import { SharedObject } from "../../../domain/entities/SharedObject";

export interface MetadataSharingWizardStep extends WizardStep {
    validationKeys: string[];
    props?: MetadataSharingWizardStepProps;
}

export interface MetadataSharingWizardStepProps {
    selection: Ref[];
    changeSelection: UpdateMethod<Ref[]>;
    excluded: string[];
    setExcluded: UpdateMethod<string[]>;
    updateStrategy: string;
    setUpdateStrategy: UpdateMethod<string>;
    sharingSettings: SharedObject;
    changeSharingSettings: UpdateMethod<SharedObject>;
    onCancel: () => void;
}

type UpdateMethod<T> = (update: T | ((prev: T) => T)) => void;

export const metadataSharingWizardSteps: MetadataSharingWizardStep[] = [
    {
        key: "select-metadata",
        label: i18n.t("Select Metadata"),
        component: SelectMetadataStep,
        validationKeys: ["selection"],
    },
    {
        key: "list-dependencies",
        label: i18n.t("List Dependencies and Exclude"),
        component: ListDependenciesStep,
        validationKeys: ["name"],
    },
    {
        key: "sharing-access",
        label: i18n.t("Sharing Access"),
        component: AccessStep,
        validationKeys: ["name"],
    },
    {
        key: "summary-apply",
        label: i18n.t("Summary and Apply Metadata"),
        component: SummaryApplyStep,
        validationKeys: ["name"],
    },
];
