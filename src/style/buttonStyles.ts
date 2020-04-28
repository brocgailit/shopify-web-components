import { css } from 'lit-element';

const buttonStyles = css`
  .button {
    display: block;
    border: none;
    border-radius: var(--shopify--radius);
    cursor: pointer;
    height: var(--shopify--size-3);
    font-size: var(--shopify--size-6);
    font-weight: 300;
    color: var(--shopify--color-white);
    background-color: var(--shopify--color-link);
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button.fullwidth {
    width: 100%;
  }

  .button:disabled {
    background-color: var(--shopify--color-grey);
    cursor: not-allowed;
  }
`

export { buttonStyles }