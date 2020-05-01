var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, internalProperty, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { base as buttonStyle } from './style/buttonStyles.js';
import { formatPrice } from './directives';
import './shopify-increment';
let AddToCart = class AddToCart extends LitElement {
    constructor() {
        super(...arguments);
        this.variants = [];
        this.quantity = 0;
        this.min = 0;
        this.max = Infinity;
        this.hideTotal = false;
        this.hideVariants = false;
        this.hideIncrement = false;
        this.notify = '';
        this.selectedId = -1;
        this.status = undefined;
    }
    static get styles() {
        return [
            buttonStyle,
            css `
        :host {
          display: block;
          max-width: 800px;
          width: 100%;
        }

        .shopify--total {
          text-align: center;
          color: var(--shopify--color-dark);
          padding: var(--shopify--size-5);
          font-size:  var(--shopify--size-3);
          margin: 0;
          line-height: 1;
        }

        .shopify--variants {
          display: flex;
          justify-content: center;
          margin-bottom: var(--shopify--size-6);
        }

        .shopify--variant{
          flex-grow: 1;
        }

        .shopify--variant:not(:last-child) {
          padding-right: var(--shopify--size-8);
        }

        .shopify--variant label {
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
          border: 2px solid transparent;
          padding: var(--shopify--size-6);
          background-color: white;
          background-color: var(--shopify--color-white);
          border-radius: var(--shopify--radius);
          color: var(--shopify--color-dark);
          font-size: var(--shopify--size-6);
          cursor: pointer;
        }

        .shopify--variant input {
          display: block;
          position: absolute;
          height: 0;
          width: 0;
          opacity: 0;
        }

        .shopify--variant input:checked + label{
          border-color: black;
          border-color: var(--shopify--color-grey);
        }

        .shopify--variant-title {
          font-weight: bold;
        }

        .shopify--variant-price {
          font-size: 90%;
        }

        shopify-increment {
          margin-bottom: var(--shopify--size-6);
        }
      `
        ];
    }
    ;
    render() {
        return html `
      <form @submit="${this.onSubmit}" action="/cart/add" method="POST" enctype="multipart/form-data">
        ${!this.hideTotal ? html `<p class="shopify--total">${formatPrice(this.total)}</p>` : ''}
        <slot></slot>
        ${!this.hideVariants ? html `
          <div class="shopify--variants">
            ${repeat(this.variants, (variant) => variant.id, (variant) => html `
                <div class="shopify--variant">
                  <input
                    type="radio"
                    name="id"
                    id="id-${variant.id}"
                    .value="${variant.id.toString()}"
                    @change="${this.onSelectVariant}"
                    ?checked="${variant.id == this.selected.id}"
                  >
                  <label for="id-${variant.id}">
                    <span class="shopify--variant-title">${variant.title}</span>
                    <span class="shopify--variant-price">${formatPrice(variant.price / 100)}</span>
                  </label>
                </div>
              `)}
          </div>
        ` : ''}
        ${!this.hideIncrement ? html `
          <shopify-increment
            min="${this.min}"
            max="${this.max}"
            .value="${this.quantity}"
            @change="${this.onInput}">
          </shopify-increment>
        ` : ''}
        <button class="button fullwidth" type="submit" ?disabled="${this.status === 'loading' || this.quantity <= 0}">
          ${this.status === 'loading' ? 'Loading' : html `Add to Cart | ${formatPrice(this.total)}`}
        </button>
      </form>
    `;
    }
    async onSubmit(event) {
        event.preventDefault();
        this.status = 'loading';
        const items = [
            {
                quantity: this.quantity,
                id: +this.selected.id,
                properties: {}
            }
        ];
        await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items })
        });
        if (this.notify && document.getElementById(this.notify)) {
            const cartEl = document.getElementById(this.notify);
            if (cartEl === null || cartEl === void 0 ? void 0 : cartEl.updateCart) {
                cartEl.updateCart();
            }
            this.animateToCart(cartEl);
        }
        this.status = 'done';
    }
    animateToCart(el) {
        const from = this.shadowRoot.querySelector('button[type="submit"]').getBoundingClientRect();
        const to = el.getBoundingClientRect();
        const transformEl = document.createElement('div');
        const { scrollY, scrollX } = window;
        transformEl.style.border = '2px dashed var(--shopify--color-grey)';
        transformEl.style.position = 'absolute';
        transformEl.style.boxSizing = 'border-box';
        transformEl.style.left = to.left + to.width / 2 + scrollX + 'px';
        transformEl.style.top = to.top + scrollY + 'px';
        transformEl.style.width = from.width + 'px';
        transformEl.style.height = from.height + 'px';
        transformEl.style.transformOrigin = 'center left';
        document.body.appendChild(transformEl);
        const animation = transformEl.animate([
            {
                transform: `scale(1) translate(${from.left - to.left}px, ${from.top - to.top}px)`,
                opacity: 1
            },
            {
                transform: 'scale(0) translate(0,0)',
                opacity: 0
            }
        ], {
            duration: 750,
            easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
        });
        animation.addEventListener('finish', function () {
            transformEl.remove();
        });
    }
    onSelectVariant({ target }) {
        this.selectedId = +target.value;
    }
    onInput(event) {
        if (this.quantity !== event.detail) {
            this.quantity = event.detail;
        }
    }
    get selected() {
        return this.variants.find(variant => variant.id === this.selectedId) || this.variants[0] || { id: null };
    }
    get price() {
        var _a;
        return ((_a = this.selected) === null || _a === void 0 ? void 0 : _a.price) ? this.selected.price / 100 : 0;
    }
    get total() {
        return this.quantity * this.price;
    }
};
__decorate([
    property({ type: Array })
], AddToCart.prototype, "variants", void 0);
__decorate([
    property({ type: Number })
], AddToCart.prototype, "quantity", void 0);
__decorate([
    property({ type: Number })
], AddToCart.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], AddToCart.prototype, "max", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-total' })
], AddToCart.prototype, "hideTotal", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-variants' })
], AddToCart.prototype, "hideVariants", void 0);
__decorate([
    property({ type: Boolean, attribute: 'hide-increment' })
], AddToCart.prototype, "hideIncrement", void 0);
__decorate([
    property({ type: String })
], AddToCart.prototype, "notify", void 0);
__decorate([
    internalProperty()
], AddToCart.prototype, "selectedId", void 0);
__decorate([
    internalProperty()
], AddToCart.prototype, "status", void 0);
AddToCart = __decorate([
    customElement('shopify-add-to-cart')
], AddToCart);
export { AddToCart };
//# sourceMappingURL=shopify-add-to-cart.js.map