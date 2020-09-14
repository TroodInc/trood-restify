export default HttpApiAdapter;
declare class HttpApiAdapter {
    static cache: {};
    constructor({ apiHost, getToken, headers, allowNoTokenEndpoints, defaultResponseFormat, }?: {
        apiHost: any;
        getToken: any;
        headers: any;
        allowNoTokenEndpoints: any;
        defaultResponseFormat: any;
    });
    getToken: any;
    apiHost: any;
    headers: any;
    allowNoTokenEndpoints: any[];
    defaultResponseFormat: any;
    getResponseData(response: any, uuid: any, format: any): Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    }>;
    callApi(endpoint: any, { method, headers: optionsHeaders, body, filters, hash, format, cacheMaxAgeMs, }?: {
        method: any;
        headers: any;
        body: any;
        filters: any;
        hash?: string | undefined;
        format: any;
        cacheMaxAgeMs?: number | undefined;
    }): Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
    callGet: (endpoint: any, options?: {}) => Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
    callPost: (endpoint: any, options?: {}) => Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
    callPut: (endpoint: any, options?: {}) => Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
    callPatch: (endpoint: any, options?: {}) => Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
    callDelete: (endpoint: any, options?: {}) => Promise<{
        uuid: any;
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
    } | {
        uuid: any;
        status: any;
        data: any;
        error?: undefined;
    } | undefined>;
}
