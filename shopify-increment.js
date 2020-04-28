var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property, css } from 'lit-element';
let Increment = class Increment extends LitElement {
    constructor() {
        super(...arguments);
        this.value = 0;
        this.min = -Infinity;
        this.max = Infinity;
    }
    render() {
        return html `
        <button
          type="button"
          @click=${() => this.increment(-1)}
          ?disabled="${this.value <= this.min}"
          aria-label="decrement"
        >
          -
        </button>
        <input
          type="number"
          id="number"
          min="${this.min}"
          .value="${this.value.toString()}"
          @input="${this.onInput}"
        >
        <button
          type="button"
          @click=${() => this.increment(1)}
          aria-label="increment">
          +
        </button>
    `;
    }
    emitUpdate() {
        const event = new CustomEvent('change', {
            detail: this.value || 0
        });
        this.dispatchEvent(event);
    }
    onInput() {
        this.value = +this.inputEl.value;
        this.emitUpdate();
    }
    increment(amount = 1) {
        if (Number.isFinite(this.min) && amount < 0 && this.value === this.min)
            return;
        if (Number.isFinite(this.max) && amount > 0 && this.value === this.max)
            return;
        this.value = this.value + amount;
        this.emitUpdate();
    }
    get inputEl() {
        return this.shadowRoot.getElementById('number');
    }
};
Increment.styles = css `
    :host {
      display: flex;
      width: 100%;
      max-width: 100%;
    }

    button {
      background-color: white;
      cursor: pointer;
    }

    input, button {
      border-radius: 0;
      border: none;
      margin: 0;
      height: var(--shopify--size-3);
    }

    input {
      flex-grow: 1;
      font-size: var(--shopify--size-5);
      width: 2rem;
      background-color: var(--shopify--color-white);
      color: var(--shopify--color-dark);
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type=number] {
      text-align: center;
      -moz-appearance: textfield;
    }

    button:disabled {
      cursor: not-allowed;
    }

    [aria-label=decrement], [aria-label=increment] {
      color: var(--shopify--color-white);
      background-color: var(--shopify--color-grey);
      width: var(--shopify--size-3);
    }

    [aria-label=decrement] {
      border-right: none;
      border-top-left-radius: var(--shopify--radius);
      border-bottom-left-radius: var(--shopify--radius);
    }

    [aria-label=increment]  {
      border-left: none;
      border-top-right-radius: var(--shopify--radius);
      border-bottom-right-radius: var(--shopify--radius);
    }
  `;
__decorate([
    property({ type: Number })
], Increment.prototype, "value", void 0);
__decorate([
    property({ type: Number })
], Increment.prototype, "min", void 0);
__decorate([
    property({ type: Number })
], Increment.prototype, "max", void 0);
Increment = __decorate([
    customElement('shopify-increment')
], Increment);
export { Increment };
//# sourceMappingURL=shopify-increment.js.map