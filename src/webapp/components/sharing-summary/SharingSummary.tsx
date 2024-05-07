import { SharingSummary as SharingSummaryI } from "../../../domain/entities/MetadataSharing";
import { NamedRef } from "../../../domain/entities/Ref";
import i18n from "../../../locales";
import styled from "styled-components";

interface SharingSummaryProps {
    summary: SharingSummaryI;
}

export const SharingSummary = ({ summary }: SharingSummaryProps) => {
    const { sharingWarnings: metadataSharings, sharingPayload: sharingsPayload } = summary;

    return (
        <div>
            <Title>{i18n.t("Changes will be made to:")}</Title>
            {Object.entries(sharingsPayload).map(([displayName, metadata]) => (
                <MetadataList key={displayName} title={pluralize(displayName)} metadata={metadata} />
            ))}

            {metadataSharings.length !== 0 && (
                <div>
                    <Title>{i18n.t("Warning:")}</Title>
                    {metadataSharings.map(metadataItem => (
                        <MetadataList
                            key={metadataItem.id}
                            title={`${metadataItem.name} (${metadataItem.id}) has different sharing settings from:`}
                            metadata={metadataItem.children}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MetadataList = ({ title, metadata }: { title: string; metadata: NamedRef[] }) => {
    return (
        <ul>
            <li>
                {i18n.t(title)}
                <ul>
                    {metadata.map(item => (
                        <li key={item.id}>{i18n.t(`${item.name} (${item.id})`)}</li>
                    ))}
                </ul>
            </li>
        </ul>
    );
};

const Title = styled.p`
    font-weight: 500;
    margin: 0;
`;

function pluralize(str: string) {
    return str.endsWith("y") ? `${str.slice(0, -1)}ies` : `${str}s`;
}
