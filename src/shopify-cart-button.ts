import { LitElement, html, customElement, property, css } from 'lit-element';
import './shopify-cart-preview';
import Defaults from './defaults';

@customElement('shopify-cart-button')
export class CartButton extends LitElement {

  private _initialized = false;

  static styles = css`

    @keyframes attention {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.5);
      }
      100% {
        transform: scale(1);
      }
    }

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

    #count.updated {
      animation: attention 500ms ease-in-out;
    }
  `;

  @property({type: Number})
  quantity = 0;

  @property({type: String, attribute: 'cart-action'})
  cartAction = Defaults.DEFAULT_CART_ACTION;

  @property({type: String, attribute: 'update-action'})
  updateAction = Defaults.DEFAULT_UPDATE_ACTION;

  @property({type: String, attribute: 'remove-action'})
  removeAction = Defaults.DEFAULT_REMOVE_ACTION;

  firstUpdated() {
    this.updateCart();
  }

  async updateCart() {
    try {
      const { item_count: count, items } = await this.getCart();
      this.quantity = count;
      if(this._initialized) {
        let preview;
        if(!document.querySelector('shopify-cart-preview')) {
          preview = document.createElement('shopify-cart-preview');
          document.body.appendChild(preview);
          preview!.addEventListener('remove', () => { this.updateCart() })
        } else {
          preview = document.querySelector('shopify-cart-preview');
        }
        preview!.setAttribute('remove-action', this.removeAction);
        preview!.setAttribute('cart-action', this.cartAction);
        preview!.items = items;
        this.animateUpdate()
      }
    } catch(error) {
      console.error(new Error('Cart is currently unavailable.'));
    }

    this._initialized = true;
  }

  private animateUpdate() {
    const animateEl = this.shadowRoot!.getElementById('count')!;
    animateEl.classList.add('updated');
    animateEl.addEventListener('animationend', this.handleAnimationEnd.bind({el: animateEl, context: this}));
  }

  private handleAnimationEnd() {
    const {el, context} = this as any;
    el.removeEventListener('animationend', context.handleAnimationEnd.bind(this));
    el.classList.remove('updated');
  }

  private async getCart() {
    return fetch(this.updateAction).then(res => res.json());
  }

  render() {
    return html`
        <a href="${this.cartAction}">
          <slot></slot>
          <slot name="display"></slot>
        </a>
        ${this.quantity ? html`<div id="count" data-count="${this.quantity}"></div>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'shopify-cart-button': CartButton;
  }
}
