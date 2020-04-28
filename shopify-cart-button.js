var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from 'lit-element';
import './shopify-cart-preview';
let CartButton = class CartButton extends LitElement {
    constructor() {
        super(...arguments);
        this._initialized = false;
        this.quantity = 0;
        this.href = '/cart';
        this.updateAction = '/cart.js';
        this.removeAction = '/cart/change.js';
    }
    firstUpdated() {
        this.updateCart();
    }
    async updateCart() {
        try {
            const { item_count: count, items } = await this.getCart();
            this.quantity = count;
            if (this._initialized) {
                let preview;
                if (!document.querySelector('shopify-cart-preview')) {
                    preview = document.createElement('shopify-cart-preview');
                    document.body.appendChild(preview);
                    preview.addEventListener('remove', () => { this.updateCart(); });
                }
                else {
                    preview = document.querySelector('shopify-cart-preview');
                }
                preview.setAttribute('remove-action', this.removeAction);
                preview.items = items;
            }
        }
        catch (error) {
            console.error(new Error('Cart is currently unavailable.'));
        }
        this._initialized = true;
    }
    async getCart() {
        return fetch(this.updateAction).then(res => res.json());
    }
    render() {
        return html `
        <a href="${this.href}">
          <slot></slot>
          <slot name="display"></slot>
        </a>
        ${this.quantity ? html `<div id="count" data-count="${this.quantity}"></div>` : ''}
    `;
    }
};
CartButton.styles = css `
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
    }

    a {
      color: currentColor;
    }

    #count {
      position: absolute;
      width: 1.35rem;
      height: 1.35rem;
      bottom: 0;
      right: 0;
      line-height: 0;
      font-size: 0.85rem;
      color: currentColor;
      pointer-events: none;
    }
    #count::before,
    #count::after {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
    }
    #count:before {
      content: '';
      background-color: currentColor;
      border-radius: 50%;
    }
    #count:after {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      content: attr(data-count);
      -webkit-filter: invert(100%);
      filter: invert(100%);
    }
  `;
__decorate([
    property({ type: Number })
], CartButton.prototype, "quantity", void 0);
__decorate([
    property({ type: String })
], CartButton.prototype, "href", void 0);
__decorate([
    property({ type: String, attribute: 'update-action' })
], CartButton.prototype, "updateAction", void 0);
__decorate([
    property({ type: String, attribute: 'remove-action' })
], CartButton.prototype, "removeAction", void 0);
CartButton = __decorate([
    customElement('shopify-cart-button')
], CartButton);
export { CartButton };
//# sourceMappingURL=shopify-cart-button.js.map