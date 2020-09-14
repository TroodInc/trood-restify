export default getHttpApiAdapter;
export { RESPONSE_FORMATS } from "./constants";
declare function getHttpApiAdapter({ apiName, apiHost, ...other }?: {
    apiName: any;
    apiHost: any;
}): any;
