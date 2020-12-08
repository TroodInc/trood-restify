declare function _default({ apiAdapter, modelName, modelPk, modelEndpoint, modelFields, }: {
    apiAdapter: any;
    modelName: any;
    modelPk: any;
    modelEndpoint: any;
    modelFields: any;
}, getStore: any, getItemModel: any, setItemModel: any): import("mobx-state-tree").IModelType<{
    modelName: import("mobx-state-tree").ISimpleType<string>;
    items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        $modelName: any;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
        $deleted: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    }, {
        readonly pk: any;
        readonly modelData: {};
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    lists: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        url: import("mobx-state-tree").ISimpleType<string>;
        count: import("mobx-state-tree").ISimpleType<number>;
        pageSizes: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
            pageSize: import("mobx-state-tree").ISimpleType<number>;
            pages: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
                page: import("mobx-state-tree").ISimpleType<number>;
                items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
                    $modelName: any;
                    $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    $error: import("mobx-state-tree").IType<number | undefined, number, number>;
                    $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
                    $deleted: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                }, {
                    readonly pk: any;
                    readonly modelData: {};
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
                $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                $error: import("mobx-state-tree").IType<number | undefined, number, number>;
                $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    asyncGetByPk(pk: any, options?: {}, includeDeleted?: boolean): any;
    getByPk(pk: any, options?: {}, includeDeleted?: boolean): any;
    asyncGetPage(page?: number, pageSize?: number, options?: {}, includeDeleted?: boolean): any;
    getPage(page?: number, pageSize?: number, options?: {}, includeDeleted?: boolean): ({
        $modelName: any;
        $loading: boolean;
        $loadedById: boolean;
        $error: number;
        $errorData: any;
        $deleted: boolean;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly pk: any;
        readonly modelData: {};
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
        $modelName: any;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
        $deleted: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    }, {
        readonly pk: any;
        readonly modelData: {};
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>)[];
    getPageLoading(page?: number, pageSize?: number, options?: {}): boolean;
    getInfinityPages(pageSize?: number, options?: {}, includeDeleted?: boolean): any[];
    getInfinityPagesLoading(pageSize?: number, options?: {}): boolean;
    getInfinityNextPageNumber(pageSize?: number, options?: {}): number | undefined;
    getInfinityNextPage(pageSize?: number, options?: {}): void;
    getPagesCount(pageSize?: number, options?: {}): number;
} & {
    createItem(data: any): ({
        $modelName: any;
        $loading: boolean;
        $loadedById: boolean;
        $error: number;
        $errorData: any;
        $deleted: boolean;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly pk: any;
        readonly modelData: {};
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        $modelName: any;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
        $deleted: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    }, {
        readonly pk: any;
        readonly modelData: {};
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
    createList(url: any, page: number | undefined, pageSize: number | undefined, responseData: any): void;
    setListLoading(url: any, page: number | undefined, pageSize: number | undefined, loading: any): void;
    setItemLoading(pk: any, loading: any): void;
    setItemError(pk: any, error: any, errorData: any): void;
    setItemDeleted(pk: any): void;
    upsert(pk: any, body: any, options?: {}): any;
    deleteByPk(pk: any, options?: {}): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
