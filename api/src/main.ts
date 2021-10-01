import * as cmd from "./adapter/cmd/index";

export const main = async () => {
    const args = process.argv.slice(2)
    try {
        cmd.rootCmd.exec(args);
    } catch (e) {
        console.log(e)
    }
}

main();
