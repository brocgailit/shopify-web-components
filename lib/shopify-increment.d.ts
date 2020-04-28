import { LitElement } from 'lit-element';
export declare class Increment extends LitElement {
    static styles: import("lit-element").CSSResult;
    value: number;
    min: number;
    max: number;
    render(): import("lit-element").TemplateResult;
    private emitUpdate;
    private onInput;
    private increment;
    private get inputEl();
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-increment': Increment;
    }
}
//# sourceMappingURL=shopify-increment.d.ts.map