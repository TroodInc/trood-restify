export default defaultApi;
declare function defaultApi(apiAdapter: any): import("mobx-state-tree").IModelType<{
    modelName: import("mobx-state-tree").ISimpleType<string>;
    items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        url: import("mobx-state-tree").ISimpleType<string>;
        data: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    asyncGetData(endpoint: any, options?: {}): any;
    getData(endpoint: any, options?: {}): any;
} & {
    createItem(url: any, data: any): void;
    setItemError(url: any, status: any, error: any): void;
    upsert(pk: any, body: any, options?: {}): any;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
