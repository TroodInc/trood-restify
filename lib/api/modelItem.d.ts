declare function _default(modelName: any, modelMeta: any, getStore: any, getItemModel: any): import("mobx-state-tree").IModelType<{
    $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
}, {
    readonly pk: any;
    getFieldType(field: any): {
        type: any;
        isReference: boolean;
        isReferenceArray?: undefined;
        isSimple?: undefined;
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
