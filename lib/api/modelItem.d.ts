declare function _default(apiModelName: any, apiModelPk: any, apiModelFields: any, getStore: any, getItemModel: any): import("mobx-state-tree").IModelType<{
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
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
