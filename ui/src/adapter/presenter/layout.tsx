import React from "react";
import {ApplicationRoute} from "./routing";
import { BrowserRouter as Router} from 'react-router-dom';
import AppHeaderBar from "./header";
interface IProps {}

export const ApplicationLayout : React.FC<IProps> = (props : IProps) => {

    return (
        <Router>
            <AppHeaderBar />
            <ApplicationRoute />
        </Router>
    );
}