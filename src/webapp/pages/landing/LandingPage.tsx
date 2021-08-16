import i18n from "@eyeseetea/d2-ui-components/locales";
import React from "react";
import { useHistory } from "react-router-dom";
import { Card, CardGrid } from "../../components/card-grid/CardGrid";

export const LandingPage: React.FC = () => {
    const history = useHistory();

    const cards: Card[] = [
        {
            title: "Sharing settings management",
            key: "main",
            children: [
                {
                    name: i18n.t("Bulk apply"),
                    description: i18n.t("Edit sharing settings to data sets, programs and dashboards."),
                    listAction: () => history.push("/apply"),
                },
                {
                    name: i18n.t("List depedencies"),
                    description: i18n.t(
                        "List the dependencies of a data set, program or dashboard and their sharing settings."
                    ),
                    listAction: () => history.push("/list-dependencies"),
                },
            ],
        },
        {
            title: "Settings",
            key: "settings",
            children: [
                {
                    name: i18n.t("Settings"),
                    listAction: () => history.push("/settings"),
                }
            ],
        },
    ];

    return <CardGrid cards={cards} />;
};
