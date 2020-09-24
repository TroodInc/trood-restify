declare function _default(apiName: any, modelName: any, modelPk: any, modelFields: any, getStore: any, getItemModel: any): import("mobx-state-tree").IModelType<{
    $modelName: any;
    $loading: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    $loadedById: import("mobx-state-tree").IType<boolean | undefined, boolean, boolean>;
    $error: import("mobx-state-tree").IType<number | undefined, number, number>;
    $errorData: import("mobx-state-tree").IMaybeNull<import("mobx-state-tree").IType<any, any, any>>;
}, {
    readonly pk: any;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
