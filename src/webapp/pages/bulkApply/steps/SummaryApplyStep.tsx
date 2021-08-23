import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import React from "react";
import { MetadataSharingWizardStepProps } from "./index";
import i18n from "@dhis2/d2-i18n";

const useStyles = makeStyles(theme => ({
    accordionHeading1: {
        marginLeft: 30,
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "55%",
        flexShrink: 0,
    },
    accordionHeading2: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    accordionDetails: {
        padding: "4px 24px 4px",
    },
    accordion: {
        paddingBottom: "10px",
    },
    tooltip: {
        maxWidth: 650,
        fontSize: "0.9em",
    },
}));

export const formatStatusTag = (value: string) => {
    const text = _.startCase(_.toLower(value));
    const color =
        value === "ERROR" || value === "FAILURE" || value === "NETWORK ERROR"
            ? "#e53935"
            : value === "DONE" || value === "SUCCESS" || value === "OK"
            ? "#7cb342"
            : "#3e2723";

    return <b style={{ color }}>{text}</b>;
};

export const SummaryApplyStep: React.FC<MetadataSharingWizardStepProps> = () => {
    const classes = useStyles();

    return (
        <Accordion defaultExpanded={true} className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.accordionHeading1}>
                    {`Type: Example 1`}
                    <br />
                    {origin && `${i18n.t("Origin")}: example origin `}
                    {origin && <br />}
                </Typography>
                <Typography className={classes.accordionHeading2}>{`${i18n.t("Status")}: status`}</Typography>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                <Typography variant="overline">{i18n.t("Summary")}</Typography>
            </AccordionDetails>
        </Accordion>
    );
};
