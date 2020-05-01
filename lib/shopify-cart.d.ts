import { LitElement } from "lit-element";
import { CartItem } from './interfaces';
import './shopify-increment';
export declare class ShopifyCartItem extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    updateAction: string;
    itemId: number;
    title: string;
    quantity: number;
    min: number;
    max: number;
    private onInput;
    removeItem(): void;
    render(): import("lit-element").TemplateResult;
}
export declare class ShopifyCart extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    updateAction: string;
    changeAction: string;
    items: CartItem[];
    subtotal: number;
    private getCart;
    updateCartData(): Promise<void>;
    updateItemQuantity(id: number, quantity: number): Promise<void>;
    connectedCallback(): void;
    firstUpdated(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-cart': ShopifyCart;
        'shopify-cart-item': ShopifyCartItem;
    }
}
//# sourceMappingURL=shopify-cart.d.ts.map