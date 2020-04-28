import { css } from 'lit-element';

const base = css`
  .button {
    padding: 0;
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

  .button:hover {
    background-color: var(--shopify--color-link-highlight);
  }

  .button.fullwidth {
    width: 100%;
  }

  .button:disabled {
    background-color: var(--shopify--color-grey);
    cursor: not-allowed;
  }

  .button.small {
    height: var(--shopify--size-4);
    font-size: var(--shopify--size-7);
  }
`

const deleteSize = 1;
const deleteThickness = 2;
const deleteStyle = css`
  .delete {
    border: none;
    opacity: 0.333;
    position: relative;
    display: inline-block;
    width: ${deleteSize}rem;
    height: ${deleteSize}rem;
    overflow: hidden;
    text-indent: -99999px;
    background-color: var(--shopify--color-grey);
    border-radius: 100%;
    transition: opacity 100ms ease-in-out;
  }
  .delete:hover {
    opacity: 0.666;
  }

  .delete:before,
  .delete:after {
    content: '';
    position: absolute;
    background-color: var(--shopify--color-white);
    width: 66%;
    height: ${deleteThickness}px;
    border-radius: ${deleteThickness}px;
    top: calc(50% - ${deleteThickness/2}px);
    left: calc((100% - 66%) / 2);
  }

  .delete:before {
    transform: rotate(-45deg);
  }

  .delete:after {
    transform: rotate(45deg);
  }
`;

export { base, deleteStyle }