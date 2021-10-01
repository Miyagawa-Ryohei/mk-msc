
import {Container} from "inversify";
import React from "react";
import {ComponentsTypes} from "./TYPES";
export const container = new Container();

Object.values(ComponentsTypes).map(v => {
    container.bind<React.FC<any>>(Symbol.for(v.path)).toFunction(require(`../adapter/presenter/components${v.path}/mainView`).MainView)
})


