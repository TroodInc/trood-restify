export namespace emptyForm {
    const data: {};
    const errors: {};
    const hasErrors: boolean;
}
declare var _default: import("mobx-state-tree").IModelType<{
    name: import("mobx-state-tree").ISimpleType<string>;
    data: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
    errors: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").IType<any, any, any>, [undefined]>;
}, {
    readonly hasErrors: any;
} & {
    changeFields(values: any): void;
    changeFieldsErrors(errors: any): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default _default;
