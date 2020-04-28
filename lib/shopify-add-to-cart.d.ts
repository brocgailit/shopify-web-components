import { LitElement } from 'lit-element';
import './shopify-increment';
export declare class AddToCart extends LitElement {
    static get styles(): import("lit-element").CSSResult[];
    variants: ProductVariant[];
    quantity: number;
    min: number;
    max: number;
    hideTotal: boolean;
    hideVariants: boolean;
    hideIncrement: boolean;
    notify: string;
    selectedId: number;
    status: 'loading' | 'done' | undefined;
    render(): import("lit-element").TemplateResult;
    private onSubmit;
    private animateToCart;
    private onSelectVariant;
    private onInput;
    private get selected();
    private get price();
    private get total();
}
interface ProductVariant {
    available: boolean;
    barcode: string | number;
    compare_at_price?: number;
    featured_image: {};
    id: number | string;
    inventory_management: string;
    name: string;
    option1: string;
    option2: string;
    option3: string;
    options: string[];
    price: number;
    public_title: string;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    title: string;
    weight: number;
}
declare global {
    interface HTMLElementTagNameMap {
        'shopify-add-to-cart': AddToCart;
    }
}
export {};
//# sourceMappingURL=shopify-add-to-cart.d.ts.map