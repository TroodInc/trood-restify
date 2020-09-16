export const defaultHeaders: {
    'Content-type': string;
};
export const defaultAllowNoTokenEndpoints: RegExp;
export const defaultPaginationTemplate: "q=limit({offset},{pageSize})";
export namespace RESPONSE_FORMATS {
    const json: string;
    const text: string;
    const blob: string;
    const formData: string;
    const arrayBuffer: string;
}
