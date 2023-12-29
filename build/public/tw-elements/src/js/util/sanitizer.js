"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = exports.DefaultAllowlist = exports.DefaultWhitelist = void 0;
const uriAttributes = new Set([
    "background",
    "cite",
    "href",
    "itemtype",
    "longdesc",
    "poster",
    "src",
    "xlink:href",
]);
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DATA_TE_ATTRIBUTE_PATTERN = /^data-te-[\w-]*$/i;
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
    const attributeName = attribute.nodeName.toLowerCase();
    if (allowedAttributeList.includes(attributeName)) {
        if (uriAttributes.has(attributeName)) {
            return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) ||
                DATA_URL_PATTERN.test(attribute.nodeValue));
        }
        return true;
    }
    const regExp = allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp);
    for (let i = 0, len = regExp.length; i < len; i++) {
        if (regExp[i].test(attributeName)) {
            return true;
        }
    }
    return false;
};
exports.DefaultWhitelist = {
    "*": [
        "class",
        "dir",
        "id",
        "lang",
        "role",
        ARIA_ATTRIBUTE_PATTERN,
        DATA_TE_ATTRIBUTE_PATTERN,
    ],
    a: ["target", "href", "title", "rel"],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ["src", "srcset", "alt", "title", "width", "height"],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
};
exports.DefaultAllowlist = {
    "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
    a: ["target", "href", "title", "rel"],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ["src", "srcset", "alt", "title", "width", "height"],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
        return unsafeHtml;
    }
    if (sanitizeFn && typeof sanitizeFn === "function") {
        return sanitizeFn(unsafeHtml);
    }
    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
    const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        const elementName = element.nodeName.toLowerCase();
        if (!Object.keys(allowList).includes(elementName)) {
            element.remove();
            continue;
        }
        const attributeList = [].concat(...element.attributes);
        const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
        attributeList.forEach((attribute) => {
            if (!allowedAttribute(attribute, allowedAttributes)) {
                element.removeAttribute(attribute.nodeName);
            }
        });
    }
    return createdDocument.body.innerHTML;
}
exports.sanitizeHtml = sanitizeHtml;
//# sourceMappingURL=sanitizer.js.map