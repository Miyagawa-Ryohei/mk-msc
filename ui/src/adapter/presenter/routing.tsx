import {Route, Switch} from "react-router";
import React from "react";
import {ComponentsTypes} from "../../infrastructure/TYPES";
import {container} from "../../infrastructure/container";
import useReactRouter from "use-react-router"
interface IProps {}

export const ApplicationRoute : React.FC<IProps> = (props : IProps) => {

    const { location , history } = useReactRouter()

    return (
        <Switch location={location}>
            {
                Object.values(ComponentsTypes).map((v) => (
                <Route exact={false}
                       key={v.path}
                       path={v.path}
                       render={() => React.createElement(container.get<React.FC>(Symbol.for(v.path)))}/>
                ))
            }
            <Route render={()=>{
                history.push(ComponentsTypes.Index.path)
                return React.createElement(container.get<React.FC>(Symbol.for(ComponentsTypes.Index.path)))}}/>
        </Switch>
    );
}