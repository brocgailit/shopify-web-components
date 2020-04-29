var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CartPreview_1;
import { LitElement, html, customElement, property, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import Defaults from './defaults';
import { directive } from 'lit-html';
import { base as buttonStyle, deleteStyle } from './style/buttonStyles.js';
const resizeImage = directive((price, size) => (part) => {
    const [, name, extension] = price.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
    part.setValue(`${name}_${size}.${extension}`);
});
let CartPreview = CartPreview_1 = class CartPreview extends LitElement {
    constructor() {
        super(...arguments);
        this.items = [];
        this.removeAction = Defaults.DEFAULT_REMOVE_ACTION;
        this.cartAction = Defaults.DEFAULT_CART_ACTION;
    }
    static get styles() {
        return [
            buttonStyle,
            deleteStyle,
            css `
        :host {
          position: fixed;
          top: calc(var(--shopify--navbar-height) + 1rem);
          right: 1rem;
          background-color: var(--shopify--color-white);
          box-shadow: 0 0 5px rgba(0,0,0,0.25);
          border-radius: var(--shopify--radius);
          z-index: 666;
          max-width: calc(100% - 2rem);
          width: 250px;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0.75rem;
        }

        li {
          padding: 1em 0;
          align-items: center;
          justify-content: space-between;
          font-size: var(--shopify--size-7);
          display: grid;
          grid-template-areas:
            'image item actions'
            'image quantity actions';
          grid-template-columns: 50px 1fr auto;
          grid-template-rows: auto 1fr;
          grid-column-gap: 10px;
        }

        li:first-child {
          padding-top: 0;
        }

        li:last-child {
          padding-bottom: 0;
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--shopify--color-grey);
        }

        .item--image {
          margin: 0;
          width: 50px;
          height: 50px;
          grid-area: image;
        }

        .item--image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item--name {
          grid-area: item;
        }

        .item--quantity {
          grid-area: quantity;
          font-size: 75%;
          color: var(--shopify--color-grey);
          align-self: flex-start;
        }

        .item--actions {
          grid-area: actions;
        }

        .button {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
      `
        ];
    }
    ;
    async removeItem(id) {
        const item = this.items.find(item => item.id === id);
        try {
            let options = {};
            if (this.removeAction === Defaults.DEFAULT_REMOVE_ACTION) {
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: `quantity=0&id=${id}`
                };
            }
            const status = await fetch(this.removeAction, options).then(res => res.status);
            if (status < 200 || status >= 300) {
                throw new Error('Unable to update item quantity due to network error.');
            }
            this.dispatchEvent(new CustomEvent('remove', { detail: item }));
            this.items = this.items.filter(item => item.id !== id);
            if (this.items.length === 0) {
                this.remove();
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    handleClose(event) {
        const rootIndex = event
            .composedPath()
            .findIndex(path => path instanceof CartPreview_1);
        if (rootIndex <= 0)
            this.remove();
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleClose.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleClose.bind(this));
    }
    render() {
        var _a;
        return ((_a = this.items) === null || _a === void 0 ? void 0 : _a.length) ? html `
      <ul>
        ${repeat(this.items, (item) => item.id, (item) => html `
          <li>
            <figure class="item--image">
              <img src="${resizeImage(item.featured_image.url, 'thumb')}">
            </figure>
            <a href="${item.url}" class="item--name">${item.title}</a>
            <span class="item--quantity">Quantity: ${item.quantity}</span>
            <div class="item--actions">
              <button class="delete" @click="${() => this.removeItem(item.id)}">
                Remove from Cart
              </button>
            </div>
          </li>
        `)}
      </ul>
      <a class="button fullwidth small" href="${this.cartAction}">
        View Cart
      </a>
    ` : '';
    }
};
__decorate([
    property({ type: Array })
], CartPreview.prototype, "items", void 0);
__decorate([
    property({ type: String, attribute: 'remove-action' })
], CartPreview.prototype, "removeAction", void 0);
__decorate([
    property({ type: String, attribute: 'cart-action' })
], CartPreview.prototype, "cartAction", void 0);
CartPreview = CartPreview_1 = __decorate([
    customElement('shopify-cart-preview')
], CartPreview);
export { CartPreview };
//# sourceMappingURL=shopify-cart-preview.js.map