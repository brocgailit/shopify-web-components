import { directive } from 'lit-html';
export const resizeImage = directive((price, size) => (part) => {
    const [, name, extension] = price.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
    part.setValue(`${name}_${size}.${extension}`);
});
export const formatPrice = directive((price) => (part) => {
    const formatted = price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    part.setValue(formatted + '');
});
//# sourceMappingURL=directives.js.map