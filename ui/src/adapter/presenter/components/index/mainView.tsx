import React, {useEffect, useState} from "react";
import {Button, Container, FormControl, Input, InputLabel, MenuItem, Select} from "@material-ui/core";

interface IProps {}

export const MainView : React.FC<IProps> = (props : IProps) => {
    const [buckets,setBuckets] = useState<string[]>([])
    const [bucket,setBucket] = useState<string>("")

    useEffect(()=> {
        const p = async () => {
            const resp = await fetch("/api/v1/upload")
            const data = await resp.json();
            setBucket(data[0])
            setBuckets(data);
        }
        p()
    },[])

    return (
        <Container>
            <form action="/api/v1/upload" method="post" encType="multipart/form-data">
                <br />
                <FormControl >
                    <InputLabel id="bucketType">engine type</InputLabel>
                    <Select
                        labelId="bucketType"
                        id="bucketType"
                        name="bucket"
                        value={bucket}
                        onChange={(e)=> {setBucket(e.target.value as string)}}
                    >
                        {buckets.map((b : string) => {
                            return (
                                <MenuItem value={b}>{b}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <br />
                <Input type="file" name="upload"/>
                <br />
                <br />
                <Button type="submit">送信する</Button>
            </form>
        </Container>
    );
}