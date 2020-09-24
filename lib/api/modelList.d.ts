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
    }, {
        readonly pk: any;
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
                }, {
                    readonly pk: any;
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
                $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                $error: import("mobx-state-tree").IType<number | undefined, number, number>;
                $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    asyncGetByPk(pk: any, options?: {}): any;
    getByPk(pk: any, options?: {}): any;
    asyncGetPage(page?: number, pageSize?: number, options?: {}): any;
    getPage(page?: number, pageSize?: number, options?: {}): ({
        $modelName: any;
        $loading: boolean;
        $loadedById: boolean;
        $error: number;
        $errorData: any;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly pk: any;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
        $modelName: any;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
    }, {
        readonly pk: any;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>)[];
    getInfinityPages(pageSize?: number, options?: {}): any[];
    getInfinityNextPageNumber(pageSize?: number, options?: {}): number | undefined;
    getInfinityNextPage(pageSize?: number, options?: {}): void;
} & {
    createItem(data: any): ({
        $modelName: any;
        $loading: boolean;
        $loadedById: boolean;
        $error: number;
        $errorData: any;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly pk: any;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        $modelName: any;
        $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
    }, {
        readonly pk: any;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
    createList(url: any, page: number | undefined, pageSize: number | undefined, responseData: any): void;
    setItemLoading(pk: any, loading: any): void;
    setItemError(pk: any, error: any, errorData: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
