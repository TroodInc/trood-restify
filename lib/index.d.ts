export function getStore(meta: {} | undefined, getToken: any): {
    apis: {};
    forms: {
        forms: import("mobx-state-tree").IMSTMap<import("mobx-state-tree").IModelType<{
            name: import("mobx-state-tree").ISimpleType<string>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
            name: import("mobx-state-tree").ISimpleType<string>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>>;
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
        }): {
            data: {};
            errors: {};
            hasErrors: boolean;
        } | ({
            name: string;
            data: any;
            errors: any;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            name: import("mobx-state-tree").ISimpleType<string>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>);
    } & {
        createForm({ formName, apiName, modelName, modelPk, values, }: {
            formName: any;
            apiName: any;
            modelName: any;
            modelPk: any;
            values: any;
        }): Promise<any>;
        setForm(formName: any, data: any): void;
    } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        forms: import("mobx-state-tree").IMapType<import("mobx-state-tree").IModelType<{
            name: import("mobx-state-tree").ISimpleType<string>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
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
        }): {
            data: {};
            errors: {};
            hasErrors: boolean;
        } | ({
            name: string;
            data: any;
            errors: any;
        } & import("mobx-state-tree/dist/internal").NonEmptyObject & {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        } & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
            name: import("mobx-state-tree").ISimpleType<string>;
            data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
            errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
        }, {
            readonly hasErrors: any;
        } & {
            changeFields(values: any): void;
            changeFieldsErrors(errors: any): void;
        }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>);
    } & {
        createForm({ formName, apiName, modelName, modelPk, values, }: {
            formName: any;
            apiName: any;
            modelName: any;
            modelPk: any;
            values: any;
        }): Promise<any>;
        setForm(formName: any, data: any): void;
    }, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
};
