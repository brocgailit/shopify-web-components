var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, customElement, html, css, property, internalProperty } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { deleteStyle } from "./style/buttonStyles";
import Defaults from './defaults';
import { formatPrice } from './directives';
import './shopify-increment';
const CartEvents = {
    get UPDATE_ITEM_QUANTITY() { return 'shopify-item:quantity'; },
    get REMOVE_ITEM() { return 'shopify-item:remove'; }
};
let ShopifyCartItem = class ShopifyCartItem extends LitElement {
    constructor() {
        super(...arguments);
        this.updateAction = Defaults.DEFAULT_CHANGE_ACTION;
        this.itemId = 0;
        this.title = '';
        this.quantity = 0;
        this.min = 0;
        this.max = Infinity;
    }
    static get styles() {
        return [
            deleteStyle
        ];
    }
    onInput(event) {
        if (this.quantity !== event.detail) {
            this.quantity = event.detail;
        }
        this.dispatchEvent(new CustomEvent(CartEvents.UPDATE_ITEM_QUANTITY, {
            bubbles: true,
            composed: true,
            detail: {
                id: this.itemId,
                quantity: this.quantity
            }
        }));
    }
    removeItem() {
        this.dispatchEvent(new CustomEvent(CartEvents.REMOVE_ITEM, {
            bubbles: true,
            composed: true,
            detail: {
                id: this.itemId
            }
        }));
    }
    render() {
        return html `<div>
      <span id="title">${this.title}</span>
      <span id="quantity">${this.quantity}</span>
      <span>${this.itemId}</span>
      <button class="delete" @click="${this.removeItem}">Remove Item</button>
      <shopify-increment
        min="${this.min}"
        max="${this.max}"
        .value="${this.quantity}"
        @change="${this.onInput}"
      >
      </shopify-increment>
    </div>`;
    }
};
__decorate([
    property({ type: String, attribute: 'remove-action' })
], ShopifyCartItem.prototype, "updateAction", void 0);
__decorate([
    property({ type: Number, attribute: 'item-id' })
], ShopifyCartItem.prototype, "itemId", void 0);
__decorate([
    property({ type: String })
], ShopifyCartItem.prototype, "title", void 0);
__decorate([
    property({ type: Number })
], ShopifyCartItem.prototype, "quantity", void 0);
__decorate([
    property({ type: Number })
], ShopifyCartItem.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], ShopifyCartItem.prototype, "max", void 0);
ShopifyCartItem = __decorate([
    customElement('shopify-cart-item')
], ShopifyCartItem);
export { ShopifyCartItem };
let ShopifyCart = class ShopifyCart extends LitElement {
    constructor() {
        super(...arguments);
        this.updateAction = Defaults.DEFAULT_UPDATE_ACTION;
        this.changeAction = Defaults.DEFAULT_CHANGE_ACTION;
        this.items = [];
        this.subtotal = 0;
    }
    static get styles() {
        return [
            deleteStyle,
            css `
        :host, form, ul {
          width: 100%;
        }
        ul {
          padding: 0;
          margin: 0;
          list-style: none;
          width: 100%;
        }
      `
        ];
    }
    async getCart() {
        return fetch(this.updateAction).then(res => res.json());
    }
    async updateCartData() {
        const { items, items_subtotal_price: subtotal } = await this.getCart();
        this.items = items;
        this.subtotal = subtotal;
    }
    async updateItemQuantity(id, quantity) {
        try {
            let options = {};
            if (this.changeAction === Defaults.DEFAULT_CHANGE_ACTION) {
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: `quantity=${quantity}&id=${id}`
                };
            }
            const status = await fetch(this.changeAction, options).then(res => res.status);
            if (status < 200 || status >= 300) {
                throw new Error('Unable to update item quantity due to network error.');
            }
            if (quantity === 0) {
                this.items = this.items.filter(item => item.id !== id);
            }
            this.updateCartData();
        }
        catch (e) {
            console.error(e);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener(CartEvents.UPDATE_ITEM_QUANTITY, (event) => {
            if (event.detail) {
                const { id, quantity } = event.detail;
                this.updateItemQuantity(id, quantity);
            }
        });
        this.addEventListener(CartEvents.REMOVE_ITEM, (event) => {
            if (event.detail) {
                const { id } = event.detail;
                this.updateItemQuantity(id, 0);
            }
        });
    }
    async firstUpdated() {
        this.updateCartData();
    }
    render() {
        return html `<form>
      <ul>
        ${repeat(this.items, (item) => item.id, (item) => html `<li>
            <shopify-cart-item
              thumbnail="${item.featured_image.url}"
              item-id="${item.id}"
              title="${item.title}"
              quantity="${item.quantity}"
            >
            </shopify-cart-item>
          </li>`)}
        </li>
      </ul>
      <div>
          Subtotal: ${formatPrice(this.subtotal)}
      </div>
    </form>`;
    }
};
__decorate([
    property({ type: String, attribute: 'update-action' })
], ShopifyCart.prototype, "updateAction", void 0);
__decorate([
    property({ type: String, attribute: 'remove-action' })
], ShopifyCart.prototype, "changeAction", void 0);
__decorate([
    internalProperty()
], ShopifyCart.prototype, "items", void 0);
__decorate([
    internalProperty()
], ShopifyCart.prototype, "subtotal", void 0);
ShopifyCart = __decorate([
    customElement('shopify-cart')
], ShopifyCart);
export { ShopifyCart };
//# sourceMappingURL=shopify-cart.js.map