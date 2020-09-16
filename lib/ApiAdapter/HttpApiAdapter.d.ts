export default HttpApiAdapter;
declare class HttpApiAdapter {
    static cache: {};
    constructor({ apiHost, getToken, headers, allowNoTokenEndpoints, defaultResponseFormat, paginationTemplate, entityDataAddress, entityErrorAddress, arrayDataAddress, arrayErrorAddress, arrayCountAddress, }?: {
        apiHost: any;
        getToken: any;
        headers?: {
            'Content-type': string;
        } | undefined;
        allowNoTokenEndpoints?: RegExp | undefined;
        defaultResponseFormat?: string | undefined;
        paginationTemplate?: string | undefined;
        entityDataAddress: any;
        entityErrorAddress: any;
        arrayDataAddress: any;
        arrayErrorAddress: any;
        arrayCountAddress: any;
    });
    getToken: any;
    apiHost: any;
    headers: {
        'Content-type': string;
    };
    allowNoTokenEndpoints: RegExp[] | (RegExp & any[]);
    defaultResponseFormat: string;
    paginationTemplate: string;
    entityDataAddress: any;
    entityErrorAddress: any;
    arrayDataAddress: any;
    arrayErrorAddress: any;
    arrayCountAddress: any;
    getResponseData(response: any, format: any, pk: any): Promise<{
        status: number;
        error: {
            global: string;
        };
        data?: undefined;
        count?: undefined;
    } | {
        status: any;
        data: any;
        error: any;
        count: number;
    }>;
    getUrl(endpoint: any, { pk, filters, hash, page, pageSize, }?: {
        pk: any;
        filters: any;
        hash?: string | undefined;
        page: any;
        pageSize: any;
    }): string;
    callApi(endpoint: any, { pk, method, headers: optionsHeaders, body, filters, page, pageSize, hash, format, cacheMaxAgeMs, }?: {
        pk: any;
        method: any;
        headers: any;
        body: any;
        filters: any;
        page: any;
        pageSize: any;
        hash: any;
        format: any;
        cacheMaxAgeMs?: number | undefined;
    }): Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
    callGet: (endpoint: any, options?: {}) => Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
    callPost: (endpoint: any, options?: {}) => Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
    callPut: (endpoint: any, options?: {}) => Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
    callPatch: (endpoint: any, options?: {}) => Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
    callDelete: (endpoint: any, options?: {}) => Promise<{
        status: any;
        data: any;
        error: any;
        count: number;
    } | {
        status: number;
        error: {
            global: any;
        };
    } | {
        status: number;
        error?: undefined;
    }>;
}
