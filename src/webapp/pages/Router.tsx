import { HashRouter, Route, Switch } from "react-router-dom";
import { BulkApplyPage } from "./bulk-apply/BulkApplyPage";
import { LandingPage } from "./landing/LandingPage";

export const Router = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/apply" render={() => <BulkApplyPage />} />

                {/* Default route */}
                <Route render={() => <LandingPage />} />
            </Switch>
        </HashRouter>
    );
};
