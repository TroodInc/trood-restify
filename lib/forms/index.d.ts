declare function _default(apisStore: any): {
    forms: import("mobx-state-tree").IMSTMap<import("mobx-state-tree").IAnyType> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IMapType<import("mobx-state-tree").IAnyType>>;
} & import("mobx-state-tree/dist/internal").NonEmptyObject & {
    getFormName({ formName, apiName, modelName, modelPk, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
    }): any;
    asyncGetForm({ formName, apiName, modelName, modelPk, values, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): Promise<any>;
    getForm({ formName, apiName, modelName, modelPk, values, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): any;
} & {
    createForm({ formName, apiName, modelName, modelPk, values, }: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): Promise<any>;
    setForm(formName: any, data: any): void;
    removeItem(item: any): void;
} & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
    forms: import("mobx-state-tree").IMapType<import("mobx-state-tree").IAnyType>;
}, {
    getFormName({ formName, apiName, modelName, modelPk, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
    }): any;
    asyncGetForm({ formName, apiName, modelName, modelPk, values, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): Promise<any>;
    getForm({ formName, apiName, modelName, modelPk, values, }?: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): any;
} & {
    createForm({ formName, apiName, modelName, modelPk, values, }: {
        formName: any;
        apiName: any;
        modelName: any;
        modelPk: any;
        values: any;
    }): Promise<any>;
    setForm(formName: any, data: any): void;
    removeItem(item: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
export default _default;
