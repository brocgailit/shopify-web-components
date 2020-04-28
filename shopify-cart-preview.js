var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CartPreview_1;
import { LitElement, html, customElement, property, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
let CartPreview = CartPreview_1 = class CartPreview extends LitElement {
    constructor() {
        super(...arguments);
        this.items = [];
        this.removeAction = this.DEFAULT_REMOVE_ACTION;
    }
    get DEFAULT_REMOVE_ACTION() { return '/cart/change.js'; }
    async removeItem(id) {
        const item = this.items.find(item => item.id === id);
        try {
            let options = {};
            if (this.removeAction === this.DEFAULT_REMOVE_ACTION) {
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
            <span>${item.title}</span>
            <button @click="${() => this.removeItem(item.id)}">
              X
            </button>
          </li>
        `)}
      </ul>
    ` : '';
    }
};
CartPreview.styles = css `
    :host {
      position: fixed;
      top: calc(var(--shopify--navbar-height) + 1rem);
      right: 1rem;
      background-color: var(--shopify--color-white);
      box-shadow: 0 0 5px rgba(0,0,0,0.25);
      border-radius: var(--shopify--radius);
      z-index: 666;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0.75rem;
    }

    li {
      padding: 1em 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    li:not(:last-child) {
      border-bottom: 1px solid var(--shopify--color-grey);
    }
  `;
__decorate([
    property({ type: Array })
], CartPreview.prototype, "items", void 0);
__decorate([
    property({ type: String, attribute: 'remove-action' })
], CartPreview.prototype, "removeAction", void 0);
CartPreview = CartPreview_1 = __decorate([
    customElement('shopify-cart-preview')
], CartPreview);
export { CartPreview };
//# sourceMappingURL=shopify-cart-preview.js.map