import { HashRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { BulkApplyPage } from "./bulk-apply/BulkApplyPage";
import { LandingPage } from "./landing/LandingPage";

export const Router = () => {
    return (
        <HashRouter>
            <Switch>
                <Container>
                    <Route path="/apply" render={() => <BulkApplyPage />} />

                    {/* Default route */}
                    <Route render={() => <LandingPage />} />
                </Container>
            </Switch>
        </HashRouter>
    );
};

const Container = styled.div`
    margin: 15px;
`;
