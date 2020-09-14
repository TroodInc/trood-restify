declare function _default(modelName: any, modelMeta: any, getStore: any, getItemModel: any, setItemModel: any): import("mobx-state-tree").IModelType<{
    modelName: import("mobx-state-tree").ISimpleType<string>;
    items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
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
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    lists: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
        mapUuid: import("mobx-state-tree").ISimpleType<string>;
        items: import("mobx-state-tree").IMapType<import("mobx-state-tree").IReferenceType<import("mobx-state-tree").IModelType<{
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
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
}, {
    getByPk(pk: any): {};
} & {
    createItem(data: any): any;
    createList(uuid: any, data?: any[]): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
