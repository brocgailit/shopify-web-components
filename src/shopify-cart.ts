import { LitElement, customElement, html, css, property, internalProperty } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { deleteStyle } from "./style/buttonStyles";
import Defaults from './defaults';
import { CartItem } from './interfaces';
import { formatPrice } from './directives';
import './shopify-increment';

const CartEvents = {
  get UPDATE_ITEM_QUANTITY() { return 'shopify-item:quantity'; },
  get REMOVE_ITEM() { return 'shopify-item:remove'; }
}

@customElement('shopify-cart-item')
export class ShopifyCartItem extends LitElement {
  static get styles() {
    return [
      deleteStyle
    ]
  }

  @property({ type: String, attribute: 'remove-action' })
  updateAction = Defaults.DEFAULT_CHANGE_ACTION;

  @property({type: Number, attribute: 'item-id'})
  itemId = 0;

  @property({type: String})
  title = '';

  @property({type: Number})
  quantity = 0;

  @property({type: Number})
  min = 0;

  @property({type: Number})
  max = Infinity;

  private onInput(event: CustomEvent) {
    if(this.quantity !== event.detail) {
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
    return html`<div>
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
    </div>`
  }
}

@customElement('shopify-cart')
export class ShopifyCart extends LitElement {

  static get styles() {
    return [
      deleteStyle,
      css`
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
    ]
  }

  @property({type: String, attribute: 'update-action'})
  updateAction = Defaults.DEFAULT_UPDATE_ACTION;

  @property({ type: String, attribute: 'remove-action' })
  changeAction = Defaults.DEFAULT_CHANGE_ACTION;

  @internalProperty()
  items: CartItem[] = [];

  @internalProperty()
  subtotal = 0;

  private async getCart() {
    return fetch(this.updateAction).then(res => res.json());
  }

  async updateCartData() {
    const { items, items_subtotal_price: subtotal } = await this.getCart();
    this.items = items;
    this.subtotal = subtotal;
  }

  async updateItemQuantity(id: number, quantity: number) {

    try {
      let options = {};
      if (this.changeAction === Defaults.DEFAULT_CHANGE_ACTION) {
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: `quantity=${quantity}&id=${id}`
        }
      }
      const status = await fetch(this.changeAction, options).then(res => res.status);

      if (status < 200 || status >= 300) {
        throw new Error('Unable to update item quantity due to network error.');
      }
      
      if (quantity === 0) {
        this.items = this.items.filter(item => item.id !== id);
      }
  
      this.updateCartData();

    } catch (e) {
      console.error(e);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(CartEvents.UPDATE_ITEM_QUANTITY, (event: ChangeEvent) => {
      if(event.detail) {
        const { id, quantity } = event.detail;
        this.updateItemQuantity(id, quantity);
      }
    })

    this.addEventListener(CartEvents.REMOVE_ITEM, (event: RemoveEvent) => {
      if(event.detail) {
        const { id } = event.detail;
        this.updateItemQuantity(id, 0);
      }
    })
  }

  async firstUpdated() {
    this.updateCartData();
  }

  render() {
    return html`<form>
      <ul>
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => html`<li>
            <shopify-cart-item
              thumbnail="${item.featured_image.url}"
              item-id="${item.id}"
              title="${item.title}"
              quantity="${item.quantity}"
            >
            </shopify-cart-item>
          </li>`
        )}
        </li>
      </ul>
      <div>
          Subtotal: ${formatPrice(this.subtotal)}
      </div>
    </form>`
  }
}

interface ChangeEvent extends Event {
  detail?: { id: number, quantity: number };
}

interface RemoveEvent extends Event {
  detail?: { id: number };
}

declare global {
  interface HTMLElementTagNameMap {
    'shopify-cart': ShopifyCart;
    'shopify-cart-item': ShopifyCartItem;
  }
}