import { LitElement, html, customElement, property, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import Defaults from './defaults';
import { resizeImage } from './directives';
import { CartItem } from './interfaces';
import { base as buttonStyle, deleteStyle } from './style/buttonStyles.js';

@customElement('shopify-cart-preview')
export class CartPreview extends LitElement {

  static get styles() {
    return [
      buttonStyle,
      deleteStyle,
      css`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
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
          transform-origin: top center;
          animation: zoomIn 250ms ease-in-out;
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
          display: flex;
          justify-content: center;
        }

        .item--image img {
          width: auto;
          height: 100%;
        }

        .item--name, .item--quantity {
          line-height: 1.5;
        }

        .item--name {
          grid-area: item;
        }

        a.item--name {
          color: var(--shopify--color-dark);
          text-decoration: none;
        }
        
        a.item--name:hover {
          text-decoration: underline;
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
    ]
  };


  @property({ type: Array })
  items: CartItem[] = [];

  @property({ type: String, attribute: 'remove-action' })
  removeAction = Defaults.DEFAULT_CHANGE_ACTION;

  @property({ type: String, attribute: 'cart-action' })
  cartAction = Defaults.DEFAULT_CART_ACTION;

  async removeItem(id: number) {
    const item = this.items.find(item => item.id === id);
    try {
      let options = {};
      if (this.removeAction === Defaults.DEFAULT_CHANGE_ACTION) {
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: `quantity=0&id=${id}`
        }
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

    } catch (e) {
      console.error(e);
    }
  }

  handleClose(event: MouseEvent) {
    const rootIndex = event
      .composedPath()
      .findIndex(path => path instanceof CartPreview);

    if (rootIndex <= 0) this.remove();

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
    return this.items?.length ? html`
      <ul>
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => html`
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
          `
        )}
      </ul>
      <a class="button fullwidth small" href="${this.cartAction}">
        View Cart
      </a>
    `: ''
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'shopify-cart-preview': CartPreview;
  }
}