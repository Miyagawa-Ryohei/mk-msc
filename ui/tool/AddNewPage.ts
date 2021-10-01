
const path = require("path")
const rs = require("readline-sync")
const fs = require("fs")
const ComponentsTypes = require("../src/infrastructure/TYPES")
const man = `
CreateNewPage Stub Generator
        Authorized r_miyagawa.
`

const projectRoot = path.join(__dirname,"../")

const main = () => {
    console.log(man)
    const showName = rs.question("which name is shown? -> ");
    const pageName = rs.question("page name? -> ");
    const iconName = rs.question("page icon? -> ");

    const componentPath = path.join(projectRoot,...["src","adapter","presenter","components",pageName]);
    const mainViewFile = path.join(componentPath,"mainView.ts");
    fs.mkdirSync(componentPath,{recursive:true})

    const settingFile = path.join(projectRoot,...["src","infrastructure","TYPES.ts"]);

    const newConfig = createConfig(pageName,iconName,showName);
    writeTypeFile(settingFile,newConfig);
    writeMainViewFile(mainViewFile,pageName);
}

const writeMainViewFile = (mainviewFile:string, pageName : string) => {
    const outputString = `import React from "react";

interface IProps {

}

export const MainView : React.FC<IProps> = (props : IProps) => {
    return (
        <div>
            <Typography variant={"h1"}>${pageName}!!</Typography>
        </div>
    );
}
`
    console.log(outputString)

}
const writeTypeFile = (settingFile : string, config : any) => {
    const typeString =
`export const ComponentsTypes : {[key : string] : {
    path : string,
    icon :string,
    name : string
}} = `;
    const outString = typeString + JSON.stringify(config,null,4);
    console.log(outString)

}

const createConfig = (pageName : string, icon : string, showName: string) => {
    const types = ComponentsTypes;
    types[pageName] = {
        path : "/"+pageName.toLowerCase(),
        icon : icon,
        name : showName
    }
    return types
}


main();

