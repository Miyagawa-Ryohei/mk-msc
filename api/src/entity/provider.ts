import {Request} from "./request";

export interface RequestProvider {
    getRequest : () => Request;
}