export default getHttpApiAdapter;
export { RESPONSE_FORMATS } from "./constants";
declare function getHttpApiAdapter({ apiName, ...other }?: {
    apiName: any;
}): any;
