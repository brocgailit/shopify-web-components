import { LitElement } from 'lit-element';
import { CartItem } from './interfaces';
export declare class CartPreview extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    items: CartItem[];
    removeAction: string;
    cartAction: string;
    removeItem(id: number): Promise<void>;
    handleClose(event: MouseEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): "" | import("lit-element").TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-cart-preview': CartPreview;
    }
}
//# sourceMappingURL=shopify-cart-preview.d.ts.map