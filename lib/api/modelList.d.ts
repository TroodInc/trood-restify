declare function _default({ apiAdapter, apiModelName, apiModelPk, apiModelEndpoint, apiModelFields, }: {
    apiAdapter: any;
    apiModelName: any;
    apiModelPk: any;
    apiModelEndpoint: any;
    apiModelFields: any;
}, getStore: any, getItemModel: any, setItemModel: any): import("mobx-state-tree").IModelType<{
    apiModelName: import("mobx-state-tree").ISimpleType<string>;
    items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        $loaded: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
    }, {
        readonly pk: any;
        getFieldType(field: any): {
            isSimple: boolean;
            type?: undefined;
            isReference?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isSimple?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isReferenceArray: boolean;
            isSimple?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isSimple: boolean;
            isIdentifier: boolean;
            isReference?: undefined;
            isReferenceArray?: undefined;
        };
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    lists: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        url: import("mobx-state-tree").ISimpleType<string>;
        count: import("mobx-state-tree").ISimpleType<number>;
        pageSizes: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
            pageSize: import("mobx-state-tree").ISimpleType<number>;
            pages: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
                page: import("mobx-state-tree").ISimpleType<number>;
                items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
                    $loaded: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                    $error: import("mobx-state-tree").IType<number | undefined, number, number>;
                    $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
                }, {
                    readonly pk: any;
                    getFieldType(field: any): {
                        isSimple: boolean;
                        type?: undefined;
                        isReference?: undefined;
                        isReferenceArray?: undefined;
                        isIdentifier?: undefined;
                    } | {
                        type: any;
                        isReference: boolean;
                        isSimple?: undefined;
                        isReferenceArray?: undefined;
                        isIdentifier?: undefined;
                    } | {
                        type: any;
                        isReference: boolean;
                        isReferenceArray: boolean;
                        isSimple?: undefined;
                        isIdentifier?: undefined;
                    } | {
                        type: any;
                        isSimple: boolean;
                        isIdentifier: boolean;
                        isReference?: undefined;
                        isReferenceArray?: undefined;
                    };
                }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
                $loaded: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
                $error: import("mobx-state-tree").IType<number | undefined, number, number>;
                $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
            }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
        }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    asyncGetByPk(pk: any, options?: {}): any;
    getByPk(pk: any, options?: {}): {};
    asyncGetPage(page?: number, pageSize?: number, options?: {}): any;
    getPage(page?: number, pageSize?: number, options?: {}): ({
        $loaded: boolean;
        $error: number;
        $errorData: any;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
        readonly pk: any;
        getFieldType(field: any): {
            isSimple: boolean;
            type?: undefined;
            isReference?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isSimple?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isReferenceArray: boolean;
            isSimple?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isSimple: boolean;
            isIdentifier: boolean;
            isReference?: undefined;
            isReferenceArray?: undefined;
        };
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
        $loaded: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
        $error: import("mobx-state-tree").IType<number | undefined, number, number>;
        $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
    }, {
        readonly pk: any;
        getFieldType(field: any): {
            isSimple: boolean;
            type?: undefined;
            isReference?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isSimple?: undefined;
            isReferenceArray?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isReference: boolean;
            isReferenceArray: boolean;
            isSimple?: undefined;
            isIdentifier?: undefined;
        } | {
            type: any;
            isSimple: boolean;
            isIdentifier: boolean;
            isReference?: undefined;
            isReferenceArray?: undefined;
        };
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>)[];
    getInfinityPages(pageSize?: number, options?: {}): any[];
    getInfinityNextPageNumber(pageSize?: number, options?: {}): number | undefined;
    getInfinityNextPage(pageSize?: number, options?: {}): void;
} & {
    createItem(data: any): any;
    createList(url: any, page: number | undefined, pageSize: number | undefined, responseData: any): void;
    setItemError(pk: any, error: any, errorData: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
