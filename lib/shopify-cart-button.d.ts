import { LitElement } from 'lit-element';
import './shopify-cart-preview';
export declare class CartButton extends LitElement {
    private _initialized;
    static styles: import("lit-element").CSSResult;
    quantity: number;
    items: never[];
    cartAction: string;
    updateAction: string;
    removeAction: string;
    firstUpdated(): void;
    updateCart(): Promise<void>;
    private displayCartPreview;
    private animateUpdate;
    private handleAnimationEnd;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private getCart;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-cart-button': CartButton;
    }
}
//# sourceMappingURL=shopify-cart-button.d.ts.map