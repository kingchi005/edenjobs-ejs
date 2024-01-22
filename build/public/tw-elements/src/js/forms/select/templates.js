"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFakeValueTemplate = exports.getFilterTemplate = exports.getOptionsListTemplate = exports.getDropdownTemplate = exports.getWrapperTemplate = void 0;
const index_1 = require("../../util/index");
const manipulator_1 = __importDefault(require("../../dom/manipulator"));
const util_1 = __importDefault(require("./util"));
const DATA_FORM_OUTLINE = "data-te-select-form-outline-ref";
const DATA_SELECT_WRAPPER = "data-te-select-wrapper-ref";
const DATA_SELECT_INPUT = "data-te-select-input-ref";
const DATA_CLEAR_BUTTON = "data-te-select-clear-btn-ref";
const DATA_SELECT_DROPDOWN_CONTAINER = "data-te-select-dropdown-container-ref";
const DATA_DROPDOWN = "data-te-select-dropdown-ref";
const DATA_OPTIONS_WRAPPER = "data-te-select-options-wrapper-ref";
const DATA_OPTIONS_LIST = "data-te-select-options-list-ref";
const DATA_FILTER_INPUT = "data-te-select-input-filter-ref";
const DATA_OPTION = "data-te-select-option-ref";
const DATA_OPTION_ALL = "data-te-select-option-all-ref";
const DATA_SELECT_OPTION_TEXT = "data-te-select-option-text-ref";
const DATA_FORM_CHECK_INPUT = "data-te-form-check-input";
const DATA_SELECT_OPTION_GROUP = "data-te-select-option-group-ref";
const DATA_SELECT_OPTION_GROUP_LABEL = "data-te-select-option-group-label-ref";
const DATA_SELECTED = "data-te-select-selected";
const iconSVGTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
`;
const preventKeydown = (event) => {
    if (event.code === "Tab" || event.code === "Esc") {
        return;
    }
    event.preventDefault();
};
function _setSizeClasses(element, config, defaultSize, smSize, lgSize) {
    if (config.selectSize === "default") {
        manipulator_1.default.addClass(element, defaultSize);
    }
    if (config.selectSize === "sm") {
        manipulator_1.default.addClass(element, smSize);
    }
    if (config.selectSize === "lg") {
        manipulator_1.default.addClass(element, lgSize);
    }
}
function getWrapperTemplate(id, config, label, classes, customArrow) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("id", id);
    wrapper.setAttribute(DATA_SELECT_WRAPPER, "");
    const formOutline = (0, index_1.element)("div");
    formOutline.setAttribute(DATA_FORM_OUTLINE, "");
    manipulator_1.default.addClass(formOutline, classes.formOutline);
    const input = (0, index_1.element)("input");
    const role = config.selectFilter ? "combobox" : "listbox";
    const multiselectable = config.multiple ? "true" : "false";
    const disabled = config.disabled ? "true" : "false";
    input.setAttribute(DATA_SELECT_INPUT, "");
    manipulator_1.default.addClass(input, classes.selectInput);
    _setSizeClasses(input, config, classes.selectInputSizeDefault, classes.selectInputSizeSm, classes.selectInputSizeLg);
    if (config.selectFormWhite) {
        manipulator_1.default.addClass(input, classes.selectInputWhite);
    }
    input.setAttribute("type", "text");
    input.setAttribute("role", role);
    input.setAttribute("aria-multiselectable", multiselectable);
    input.setAttribute("aria-disabled", disabled);
    input.setAttribute("aria-haspopup", "true");
    input.setAttribute("aria-expanded", false);
    if (config.tabIndex) {
        input.setAttribute("tabIndex", config.tabIndex);
    }
    if (config.disabled) {
        input.setAttribute("disabled", "");
    }
    if (config.selectPlaceholder !== "") {
        input.setAttribute("placeholder", config.selectPlaceholder);
    }
    if (config.selectValidation) {
        manipulator_1.default.addStyle(input, {
            "pointer-events": "none",
            "caret-color": "transparent",
        });
        manipulator_1.default.addStyle(formOutline, { cursor: "pointer" });
    }
    else {
        input.setAttribute("readonly", "true");
    }
    if (config.selectValidation) {
        input.setAttribute("required", "true");
        input.setAttribute("aria-required", "true");
        input.addEventListener("keydown", preventKeydown);
    }
    const validFeedback = (0, index_1.element)("div");
    manipulator_1.default.addClass(validFeedback, classes.selectValidationValid);
    const validFeedBackText = document.createTextNode(`${config.selectValidFeedback}`);
    validFeedback.appendChild(validFeedBackText);
    const invalidFeedback = (0, index_1.element)("div");
    manipulator_1.default.addClass(invalidFeedback, classes.selectValidationInvalid);
    const invalidFeedBackText = document.createTextNode(`${config.selectInvalidFeedback}`);
    invalidFeedback.appendChild(invalidFeedBackText);
    const clearBtn = (0, index_1.element)("span");
    clearBtn.setAttribute(DATA_CLEAR_BUTTON, "");
    manipulator_1.default.addClass(clearBtn, classes.selectClearBtn);
    _setSizeClasses(clearBtn, config, classes.selectClearBtnDefault, classes.selectClearBtnSm, classes.selectClearBtnLg);
    if (config.selectFormWhite) {
        manipulator_1.default.addClass(clearBtn, classes.selectClearBtnWhite);
    }
    const clearBtnText = document.createTextNode("\u2715");
    clearBtn.appendChild(clearBtnText);
    clearBtn.setAttribute("tabindex", "0");
    const arrow = (0, index_1.element)("span");
    manipulator_1.default.addClass(arrow, classes.selectArrow);
    _setSizeClasses(arrow, config, classes.selectArrowDefault, classes.selectArrowSm, classes.selectArrowLg);
    if (config.selectFormWhite) {
        manipulator_1.default.addClass(arrow, classes.selectArrowWhite);
    }
    arrow.innerHTML = customArrow ? customArrow : iconSVGTemplate;
    formOutline.appendChild(input);
    if (label) {
        manipulator_1.default.addClass(label, classes.selectLabel);
        _setSizeClasses(label, config, classes.selectLabelSizeDefault, classes.selectLabelSizeSm, classes.selectLabelSizeLg);
        if (config.selectFormWhite) {
            manipulator_1.default.addClass(label, classes.selectLabelWhite);
        }
        formOutline.appendChild(label);
    }
    if (config.selectValidation) {
        formOutline.appendChild(validFeedback);
        formOutline.appendChild(invalidFeedback);
    }
    if (config.selectClearButton) {
        formOutline.appendChild(clearBtn);
    }
    formOutline.appendChild(arrow);
    wrapper.appendChild(formOutline);
    return wrapper;
}
exports.getWrapperTemplate = getWrapperTemplate;
function getDropdownTemplate(id, config, width, height, selectAllOption, options, customContent, classes) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.setAttribute(DATA_SELECT_DROPDOWN_CONTAINER, "");
    manipulator_1.default.addClass(dropdownContainer, classes.selectDropdownContainer);
    dropdownContainer.setAttribute("id", `${id}`);
    dropdownContainer.style.width = `${width}px`;
    const dropdown = document.createElement("div");
    dropdown.setAttribute("tabindex", 0);
    dropdown.setAttribute(DATA_DROPDOWN, "");
    manipulator_1.default.addClass(dropdown, classes.dropdown);
    const optionsWrapper = (0, index_1.element)("div");
    optionsWrapper.setAttribute(DATA_OPTIONS_WRAPPER, "");
    manipulator_1.default.addClass(optionsWrapper, classes.optionsWrapper);
    manipulator_1.default.addClass(optionsWrapper, classes.optionsWrapperScrollbar);
    optionsWrapper.style.maxHeight = `${height}px`;
    const optionsList = getOptionsListTemplate(options, selectAllOption, config, classes);
    optionsWrapper.appendChild(optionsList);
    if (config.selectFilter) {
        dropdown.appendChild(getFilterTemplate(config.selectSearchPlaceholder, classes));
    }
    dropdown.appendChild(optionsWrapper);
    if (customContent) {
        dropdown.appendChild(customContent);
    }
    dropdownContainer.appendChild(dropdown);
    return dropdownContainer;
}
exports.getDropdownTemplate = getDropdownTemplate;
function getOptionsListTemplate(options, selectAllOption, config, classes) {
    const optionsList = (0, index_1.element)("div");
    optionsList.setAttribute(DATA_OPTIONS_LIST, "");
    manipulator_1.default.addClass(optionsList, classes.optionsList);
    let optionsNodes;
    if (config.multiple) {
        optionsNodes = getMultipleOptionsNodes(options, selectAllOption, config, classes);
    }
    else {
        optionsNodes = getSingleOptionsNodes(options, config, classes);
    }
    optionsNodes.forEach((node) => {
        optionsList.appendChild(node);
    });
    return optionsList;
}
exports.getOptionsListTemplate = getOptionsListTemplate;
function getFilterTemplate(placeholder, classes) {
    const inputGroup = (0, index_1.element)("div");
    manipulator_1.default.addClass(inputGroup, classes.inputGroup);
    const input = (0, index_1.element)("input");
    input.setAttribute(DATA_FILTER_INPUT, "");
    manipulator_1.default.addClass(input, classes.selectFilterInput);
    input.placeholder = placeholder;
    input.setAttribute("role", "searchbox");
    input.setAttribute("type", "text");
    inputGroup.appendChild(input);
    return inputGroup;
}
exports.getFilterTemplate = getFilterTemplate;
function getSingleOptionsNodes(options, config, classes) {
    const nodes = getOptionsNodes(options, config, classes);
    return nodes;
}
function getMultipleOptionsNodes(options, selectAllOption, config, classes) {
    let selectAllNode = null;
    if (config.selectAll) {
        selectAllNode = createSelectAllNode(selectAllOption, options, config, classes);
    }
    const optionsNodes = getOptionsNodes(options, config, classes);
    const nodes = selectAllNode ? [selectAllNode, ...optionsNodes] : optionsNodes;
    return nodes;
}
function getOptionsNodes(options, config, classes) {
    const nodes = [];
    options.forEach((option) => {
        const isOptionGroup = Object.prototype.hasOwnProperty.call(option, "options");
        if (isOptionGroup) {
            const group = createOptionGroupTemplate(option, config, classes);
            nodes.push(group);
        }
        else {
            nodes.push(createOptionTemplate(option, config, classes));
        }
    });
    return nodes;
}
function createSelectAllNode(option, options, config, classes) {
    const isSelected = (0, util_1.default)(options);
    const optionNode = (0, index_1.element)("div");
    optionNode.setAttribute(DATA_OPTION, "");
    const classList = classes.selectAllOption || classes.selectOption;
    manipulator_1.default.addClass(optionNode, classList);
    optionNode.setAttribute(DATA_OPTION_ALL, "");
    manipulator_1.default.addStyle(optionNode, {
        height: `${config.selectOptionHeight}px`,
    });
    optionNode.setAttribute("role", "option");
    optionNode.setAttribute("aria-selected", isSelected);
    if (isSelected) {
        optionNode.setAttribute(DATA_SELECTED, "");
    }
    optionNode.appendChild(getOptionContentTemplate(option, config, classes));
    option.setNode(optionNode);
    return optionNode;
}
function createOptionTemplate(option, config, classes) {
    if (option.node) {
        return option.node;
    }
    const optionNode = (0, index_1.element)("div");
    optionNode.setAttribute(DATA_OPTION, "");
    manipulator_1.default.addClass(optionNode, classes.selectOption);
    manipulator_1.default.addStyle(optionNode, {
        height: `${config.selectOptionHeight}px`,
    });
    manipulator_1.default.setDataAttribute(optionNode, "id", option.id);
    optionNode.setAttribute("role", "option");
    optionNode.setAttribute("aria-selected", option.selected);
    optionNode.setAttribute("aria-disabled", option.disabled);
    if (option.selected) {
        optionNode.setAttribute(DATA_SELECTED, "");
    }
    if (option.disabled) {
        optionNode.setAttribute("data-te-select-option-disabled", true);
    }
    if (option.hidden) {
        manipulator_1.default.addClass(optionNode, "hidden");
    }
    optionNode.appendChild(getOptionContentTemplate(option, config, classes));
    if (option.icon) {
        optionNode.appendChild(getOptionIconTemplate(option, classes));
    }
    option.setNode(optionNode);
    return optionNode;
}
function getOptionContentTemplate(option, config, classes) {
    const content = (0, index_1.element)("span");
    content.setAttribute(DATA_SELECT_OPTION_TEXT, "");
    manipulator_1.default.addClass(content, classes.selectOptionText);
    const label = document.createTextNode(option.label);
    if (config.multiple) {
        content.appendChild(getCheckboxTemplate(option, classes));
    }
    content.appendChild(label);
    if (option.secondaryText || typeof option.secondaryText === "number") {
        content.appendChild(getSecondaryTextTemplate(option.secondaryText, classes));
    }
    return content;
}
function getSecondaryTextTemplate(text, classes) {
    const span = (0, index_1.element)("span");
    manipulator_1.default.addClass(span, classes.selectOptionSecondaryText);
    const textContent = document.createTextNode(text);
    span.appendChild(textContent);
    return span;
}
function getCheckboxTemplate(option, classes) {
    const checkbox = (0, index_1.element)("input");
    checkbox.setAttribute("type", "checkbox");
    manipulator_1.default.addClass(checkbox, classes.formCheckInput);
    checkbox.setAttribute(DATA_FORM_CHECK_INPUT, "");
    const label = (0, index_1.element)("label");
    if (option.selected) {
        checkbox.setAttribute("checked", true);
    }
    if (option.disabled) {
        checkbox.setAttribute("disabled", true);
    }
    checkbox.appendChild(label);
    return checkbox;
}
function getOptionIconTemplate(option, classes) {
    const container = (0, index_1.element)("span");
    const image = (0, index_1.element)("img");
    manipulator_1.default.addClass(image, classes.selectOptionIcon);
    image.src = option.icon;
    container.appendChild(image);
    return container;
}
function createOptionGroupTemplate(optionGroup, config, classes) {
    const group = (0, index_1.element)("div");
    group.setAttribute(DATA_SELECT_OPTION_GROUP, "");
    manipulator_1.default.addClass(group, classes.selectOptionGroup);
    group.setAttribute("role", "group");
    group.setAttribute("id", optionGroup.id);
    if (optionGroup.hidden) {
        manipulator_1.default.addClass(group, "hidden");
    }
    const label = (0, index_1.element)("label");
    label.setAttribute(DATA_SELECT_OPTION_GROUP_LABEL, "");
    manipulator_1.default.addClass(label, classes.selectOptionGroupLabel);
    manipulator_1.default.addStyle(label, { height: `${config.selectOptionHeight}px` });
    label.setAttribute("for", optionGroup.id);
    label.textContent = optionGroup.label;
    group.appendChild(label);
    optionGroup.options.forEach((option) => {
        group.appendChild(createOptionTemplate(option, config, classes));
    });
    return group;
}
function getFakeValueTemplate(value, classes) {
    const fakeValue = (0, index_1.element)("div");
    fakeValue.textContent = value;
    manipulator_1.default.addClass(fakeValue, classes.selectLabel);
    manipulator_1.default.addClass(fakeValue, classes.selectFakeValue);
    return fakeValue;
}
exports.getFakeValueTemplate = getFakeValueTemplate;
//# sourceMappingURL=templates.js.map