import { LitElement, html, customElement, property, internalProperty, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { base as buttonStyle } from './style/buttonStyles.js';
import { formatPrice } from './directives';
import './shopify-increment';

@customElement('shopify-add-to-cart')
export class AddToCart extends LitElement {

  static get styles() {
    return [
      buttonStyle,
      css`
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
    ]
  };

  @property({type: Array})
  variants: ProductVariant[] = [];

  @property({type: Number})
  quantity = 0;

  @property({type: Number})
  min = 0;

  @property({type: Number})
  max = Infinity;

  @property({type: Boolean, attribute: 'hide-total'})
  hideTotal = false;

  @property({type: Boolean, attribute: 'hide-variants'})
  hideVariants = false;

  @property({type: Boolean, attribute: 'hide-increment'})
  hideIncrement = false;

  @property({type: String})
  notify = '';

  @internalProperty()
  selectedId = -1;

  @internalProperty()
  status: 'loading' | 'done' | undefined = undefined;

  render() {
    return html`
      <form @submit="${this.onSubmit}" action="/cart/add" method="POST" enctype="multipart/form-data">
        ${!this.hideTotal ? html`<p class="shopify--total">${formatPrice(this.total)}</p>`: ''}
        <slot></slot>
        ${!this.hideVariants ? html`
          <div class="shopify--variants">
            ${repeat(
              this.variants,
              (variant) => variant.id,
              (variant) => html`
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
              `
            )}
          </div>
        `: ''}
        ${!this.hideIncrement ? html`
          <shopify-increment
            min="${this.min}"
            max="${this.max}"
            .value="${this.quantity}"
            @change="${this.onInput}">
          </shopify-increment>
        `: ''}
        <button class="button fullwidth" type="submit" ?disabled="${this.status === 'loading' || this.quantity <= 0}">
          ${this.status === 'loading' ? 'Loading' : html`Add to Cart | ${formatPrice(this.total)}`}
        </button>
      </form>
    `;
  }

  private async onSubmit(event: Event) {
    event.preventDefault();
    this.status = 'loading';
    const items: CartItem[] = [
      {
        quantity: this.quantity,
        id: +this.selected.id,
        properties: {}
      }
    ]
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    
    if(this.notify && document.getElementById(this.notify)) {
      const cartEl = document.getElementById(this.notify) as CartElement;
      if(cartEl?.updateCart) {
        cartEl.updateCart();
      }
      this.animateToCart(cartEl);
    }
    this.status = 'done';
  }

  private animateToCart(el: HTMLElement | null) {
    const from = this.shadowRoot!.querySelector('button[type="submit"]')!.getBoundingClientRect();
    const to = el!.getBoundingClientRect();
    const transformEl = document.createElement('div');

    const { scrollY, scrollX } = window;
    transformEl.style.border = '2px dashed var(--shopify--color-grey)';
    transformEl.style.position = 'absolute';
    transformEl.style.boxSizing = 'border-box';
    transformEl.style.left = to.left + to.width/2 + scrollX + 'px';
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

    animation.addEventListener('finish', function() {
      transformEl.remove();
    });
  }

  private onSelectVariant({target}: {target: HTMLInputElement}) {
    this.selectedId = +target.value;
  }

  private onInput(event: CustomEvent) {
    if(this.quantity !== event.detail) {
      this.quantity = event.detail;
    }
  }

  private get selected(): ProductVariant {
    return this.variants.find(variant => variant.id === this.selectedId) || this.variants[0] || {id: null}
  }

  private get price(): number {
    return this.selected?.price ? this.selected.price / 100 : 0;
  }

  private get total(): number {
    return this.quantity * this.price;
  }
}

interface CartElement extends HTMLElement {
  updateCart: () => void;
}

interface CartItem {
  quantity: number;
  id: number;
  properties: object;
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
