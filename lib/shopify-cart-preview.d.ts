import { LitElement } from 'lit-element';
export declare class CartPreview extends LitElement {
    get DEFAULT_REMOVE_ACTION(): string;
    static styles: import("lit-element").CSSResult;
    items: CartItem[];
    removeAction: string;
    removeItem(id: number): Promise<void>;
    handleClose(event: MouseEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): "" | import("lit-element").TemplateResult;
}
interface CartItem {
    id: number;
    title: string;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-cart-preview': CartPreview;
    }
}
export {};
//# sourceMappingURL=shopify-cart-preview.d.ts.map