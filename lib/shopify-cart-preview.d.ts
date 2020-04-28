import { LitElement } from 'lit-element';
export declare class CartPreview extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    items: CartItem[];
    removeAction: string;
    cartAction: string;
    removeItem(id: number): Promise<void>;
    handleClose(event: MouseEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-element").TemplateResult | "";
}
interface CartItem {
    id: number;
    title: string;
    quantity: number;
    featured_image: FeaturedImage;
}
interface FeaturedImage {
    url: string;
    alt: string;
    aspect_ratio: number;
    width: number;
    height: number;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-cart-preview': CartPreview;
    }
}
export {};
//# sourceMappingURL=shopify-cart-preview.d.ts.map