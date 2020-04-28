import { LitElement, html, customElement, property, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import Defaults from './defaults';

import { directive } from 'lit-html';
import { buttonStyles } from './style/buttonStyles.js';

const resizeImage = directive((price, size) => (part) => {
  const [, name, extension] = price.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
  part.setValue(`${name}_${size}.${extension}`);
});

@customElement('shopify-cart-preview')
export class CartPreview extends LitElement {

  static get styles() {
    return [
      buttonStyles,
      css`
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
      font-size: var(--shopify--size-7);
      display: grid;
      grid-template:
        'image item actions'
        'image quantity actions';
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

    .item--actions {
      grid-area: actions;
    }
  `
    ]
  };


  @property({ type: Array })
  items: CartItem[] = [];

  @property({ type: String, attribute: 'remove-action' })
  removeAction = Defaults.DEFAULT_REMOVE_ACTION;

  @property({ type: String, attribute: 'cart-action' })
  cartAction = Defaults.DEFAULT_CART_ACTION;

  async removeItem(id: number) {
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
        ${repeat(this.items, (item) => item.id, (item) => html`
          <li>
            <figure class="item--image">
              <img src="${resizeImage(item.featured_image.url, 'thumb')}">
            </figure>
            <span class="item--name">${item.title}</span>
            <span class="item--quantity">Quantity: ${item.quantity}</span>
            <div class="item--actions">
              <button @click="${() => this.removeItem(item.id)}">
                X
              </button>
            </div>
          </li>
        `)}
      </ul>
      <a class="button fullwidth" href="${this.cartAction}">
        View Cart
      </a>
    `: ''
  }
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