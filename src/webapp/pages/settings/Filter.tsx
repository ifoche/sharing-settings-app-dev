import { displayName, MetadataModel } from "../../../domain/entities/MetadataItem";
import Dropdown, { DropdownOption } from "../../components/dropdown/Dropdown";
import _ from "lodash";
import i18n from "../../../locales";
import { useSettingsPage } from "./useSettingsPage";

export const Filter = () => {
    const { listOptions, onChangeModel } = useSettingsPage();

    return (
        <Dropdown<MetadataModel>
            items={filterModels}
            onValueChange={onChangeModel}
            value={listOptions.model}
            label={i18n.t("Metadata type")}
            hideEmpty={true}
        />
    );
};

const filterModels: DropdownOption<MetadataModel>[] = _(displayName)
    .map((name, id) => ({
        id: id as MetadataModel,
        name: i18n.t(name),
    }))
    .sortBy("name")
    .value();
