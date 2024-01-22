"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../util/index");
const data_1 = __importDefault(require("../dom/data"));
const event_handler_1 = __importDefault(require("../dom/event-handler"));
const manipulator_1 = __importDefault(require("../dom/manipulator"));
const selector_engine_1 = __importDefault(require("../dom/selector-engine"));
const NAME = "lightbox";
const DATA_KEY = "te.lightbox";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const SELECTOR_ATTR_LIGHTBOX = "[data-te-lightbox-init]";
const SELECTOR_ATTR_TOGGLE = `${SELECTOR_ATTR_LIGHTBOX} img:not([data-te-lightbox-disabled])`;
const ATTR_LIGHTBOX_CAPTION = `data-te-lightbox-caption`;
const ATTR_LIGHTBOX_DISABLED = `data-te-lightbox-disabled`;
const ATTR_STATE_ACTIVE = `data-te-lightbox-active`;
const prevIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
</svg>
`;
const nextIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg>
`;
const showFullscreenIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
</svg>
`;
const hideFullscreenIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
</svg>
`;
const zoomInIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
</svg>
`;
const zoomOutIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
</svg>
`;
const closeIconTemplate = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`;
const OPTIONS_TYPE = {
    container: "string",
    zoomLevel: "(number|string)",
    prevIconTemplate: "string",
    nextIconTemplate: "string",
    showFullscreenIconTemplate: "string",
    hideFullscreenIconTemplate: "string",
    zoomInIconTemplate: "string",
    closeIconTemplate: "string",
    zoomOutIconTemplate: "string",
    spinnerContent: "string",
};
const DEFAULT_OPTIONS = {
    container: "body",
    zoomLevel: 1,
    prevIconTemplate: prevIconTemplate,
    nextIconTemplate: nextIconTemplate,
    showFullscreenIconTemplate: showFullscreenIconTemplate,
    hideFullscreenIconTemplate: hideFullscreenIconTemplate,
    zoomInIconTemplate: zoomInIconTemplate,
    zoomOutIconTemplate: zoomOutIconTemplate,
    closeIconTemplate: closeIconTemplate,
    spinnerContent: "Loading...",
};
const DefaultClasses = {
    caption: "text-white text-ellipsis overflow-hidden whitespace-nowrap mx-[10px] text-center",
    captionWrapper: "fixed left-0 bottom-0 w-full h-[50px] flex justify-center items-center",
    closeBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
    fullscreenBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
    gallery: "invisible fixed left-0 top-0 w-full h-full z-[1100] pointer-events-none opacity-0 bg-[#000000e6] transition-all duration-[400ms] motion-reduce:transition-none",
    galleryContent: "fixed top-[50px] left-[50px] w-[calc(100%-100px)] h-[calc(100%-100px)]",
    galleryCounter: "flex justify-center items-center px-[10px] mb-0 h-full text-[#b3b3b3]",
    img: "absolute left-0 top-0 w-full max-h-full h-auto cursor-pointer pointer-events-auto",
    imgWrapper: "absolute top-0 left-0 w-full h-full opacity-0 transform scale-[0.25] transition-all duration-[400ms] ease-out pointer-events-none motion-reduce:transition-none motion-reduce:transform-none",
    leftTools: "float-left h-full",
    loader: "fixed left-0 top-0 z-[2] w-full h-full text-neutral-50 opacity-1 flex justify-center items-center pointer-events-none transition-opacity duration-[1000ms] motion-reduce:transition-none",
    nextBtn: "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
    nextBtnWrapper: "fixed right-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
    prevBtn: "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
    prevBtnWrapper: "fixed left-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
    rightTools: "float-right",
    spinner: "inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]",
    spinnerContent: "!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]",
    toolbar: "absolute top-0 left-0 w-full h-[50px] z-20 transition-opacity duration-[400ms] motion-reduce:transition-none",
    vertical: "h-full max-h-full w-auto",
    zoomBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
};
const DefaultClassesType = {
    caption: "string",
    captionWrapper: "string",
    closeBtn: "string",
    fullscreenBtn: "string",
    gallery: "string",
    galleryContent: "string",
    galleryCounter: "string",
    img: "string",
    imgWrapper: "string",
    leftTools: "string",
    loader: "string",
    nextBtn: "string",
    nextBtnWrapper: "string",
    prevBtn: "string",
    prevBtnWrapper: "string",
    rightTools: "string",
    spinner: "string",
    spinnerContent: "string",
    toolbar: "string",
    vertical: "string",
    zoomBtn: "string",
};
class Lightbox {
    constructor(element, options = {}, classes) {
        this._element = element;
        this._options = options;
        this._classes = this._getClasses(classes);
        this._getContainer();
        this._id = `lightbox-${Math.random().toString(36).substr(2, 9)}`;
        this._activeImg = 0;
        this._images = [];
        this._zoom = 1;
        this._gallery = null;
        this._galleryToolbar = null;
        this._galleryContent = null;
        this._loader = null;
        this._imgCounter = null;
        this._animating = false;
        this._fullscreen = false;
        this._zoomBtn = null;
        this._fullscreenBtn = null;
        this._toolsToggleTimer = 0;
        this._mousedown = false;
        this._mousedownPositionX = 0;
        this._mousedownPositionY = 0;
        this._originalPositionX = 0;
        this._originalPositionY = 0;
        this._positionX = 0;
        this._positionY = 0;
        this._zoomTimer = 0;
        this._tapCounter = 0;
        this._tapTime = 0;
        this._rightArrow = null;
        this._leftArrowWrapper = null;
        this._rightArrowWrapper = null;
        this._initiated = false;
        this._multitouch = false;
        this._touchZoomPosition = [];
        if (this._element) {
            data_1.default.setData(element, DATA_KEY, this);
            this.init();
        }
    }
    static get NAME() {
        return NAME;
    }
    get activeImg() {
        return this._activeImg;
    }
    get currentImg() {
        return selector_engine_1.default.findOne(`[${ATTR_STATE_ACTIVE}]`, this._galleryContent);
    }
    get options() {
        const config = Object.assign(Object.assign(Object.assign({}, DEFAULT_OPTIONS), manipulator_1.default.getDataAttributes(this._element)), this._options);
        (0, index_1.typeCheckConfig)(NAME, config, OPTIONS_TYPE);
        return config;
    }
    init() {
        if (this._initiated) {
            return;
        }
        this._appendTemplate();
        this._initiated = true;
    }
    open(target = 0) {
        this._getImages();
        this._setActiveImg(target);
        this._sortImages();
        this._triggerEvents("open", "opened");
        this._loadImages().then((images) => {
            this._resizeImages(images);
            this._toggleTemplate();
            this._addEvents();
            this._focusFullscreenBtn();
        });
    }
    close() {
        this.reset();
        this._removeEvents();
        this._toggleTemplate();
        this._triggerEvents("close", "closed");
    }
    slide(target = "right") {
        if (this._animating === true || this._images.length <= 1)
            return;
        this._triggerEvents("slide", "slided");
        this._beforeSlideEvents();
        if (target === "right")
            this._slideHorizontally(target);
        if (target === "left")
            this._slideHorizontally(target);
        if (target === "first")
            this._slideToTarget(target);
        if (target === "last")
            this._slideToTarget(target);
        this._afterSlideEvents();
    }
    zoomIn() {
        if (this._zoom >= 3)
            return;
        this._triggerEvents("zoomIn", "zoomedIn");
        this._zoom += parseFloat(this.options.zoomLevel);
        manipulator_1.default.style(this.currentImg.parentNode, {
            transform: `scale(${this._zoom})`,
        });
        this._updateZoomBtn();
    }
    zoomOut() {
        if (this._zoom <= 1)
            return;
        this._triggerEvents("zoomOut", "zoomedOut");
        this._zoom -= parseFloat(this.options.zoomLevel);
        manipulator_1.default.style(this.currentImg.parentNode, {
            transform: `scale(${this._zoom})`,
        });
        this._updateZoomBtn();
        this._updateImgPosition();
    }
    toggleFullscreen() {
        if (this._fullscreen === false) {
            this._fullscreenBtn.setAttribute(ATTR_STATE_ACTIVE, "");
            this._fullscreenBtn.innerHTML = this.options.hideFullscreenIconTemplate;
            if (this._gallery.requestFullscreen) {
                this._gallery.requestFullscreen();
            }
            this._fullscreen = true;
        }
        else {
            this._fullscreenBtn.removeAttribute(ATTR_STATE_ACTIVE);
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            this._fullscreen = false;
        }
    }
    reset() {
        this._restoreDefaultFullscreen();
        this._restoreDefaultPosition();
        this._restoreDefaultZoom();
        clearTimeout(this._toolsToggleTimer);
        clearTimeout(this._doubleTapTimer);
    }
    dispose() {
        event_handler_1.default.off(document, EVENT_CLICK_DATA_API, SELECTOR_ATTR_TOGGLE, this.toggle);
        if (this._galleryContent)
            this._removeEvents();
        if (this._gallery)
            this._gallery.remove();
        data_1.default.removeData(this._element, DATA_KEY);
        this._element = null;
    }
    _getClasses(classes) {
        const dataAttributes = manipulator_1.default.getDataClassAttributes(this._element);
        classes = Object.assign(Object.assign(Object.assign({}, DefaultClasses), dataAttributes), classes);
        (0, index_1.typeCheckConfig)(NAME, classes, DefaultClassesType);
        return classes;
    }
    _getImages() {
        const allImages = selector_engine_1.default.find("img", this._element);
        const lightboxImages = allImages.filter((image) => !image.hasAttribute(ATTR_LIGHTBOX_DISABLED));
        this._images = lightboxImages;
    }
    _getContainer() {
        this._container = selector_engine_1.default.findOne(this.options.container);
    }
    _setActiveImg(target) {
        this._activeImg =
            typeof target === "number" ? target : this._images.indexOf(target.target);
    }
    _appendTemplate() {
        this._gallery = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._gallery, `${this._classes.gallery}`);
        this._element.dataset.id = this._id;
        this._gallery.id = this._id;
        this._appendLoader();
        this._appendToolbar();
        this._appendContent();
        this._appendArrows();
        this._appendCaption();
        this._container.append(this._gallery);
    }
    _appendToolbar() {
        this._galleryToolbar = (0, index_1.element)("div");
        this._imgCounter = (0, index_1.element)("p");
        this._fullscreenBtn = (0, index_1.element)("button");
        this._zoomBtn = (0, index_1.element)("button");
        const closeBtn = (0, index_1.element)("button");
        const leftTools = (0, index_1.element)("div");
        const rightTools = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._galleryToolbar, `${this._classes.toolbar}`);
        manipulator_1.default.addClass(this._imgCounter, `${this._classes.galleryCounter}`);
        manipulator_1.default.addClass(this._fullscreenBtn, `${this._classes.fullscreenBtn}`);
        manipulator_1.default.addClass(this._zoomBtn, `${this._classes.zoomInBtn}`);
        manipulator_1.default.addClass(this._zoomBtn, this._classes.zoomBtn);
        manipulator_1.default.addClass(leftTools, `${this._classes.leftTools}`);
        manipulator_1.default.addClass(rightTools, `${this._classes.rightTools}`);
        manipulator_1.default.addClass(closeBtn, `${this._classes.closeBtn}`);
        this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate;
        closeBtn.innerHTML = this.options.closeIconTemplate;
        this._zoomBtn.innerHTML = this.options.zoomInIconTemplate;
        this._fullscreenBtn.setAttribute("aria-label", "Toggle fullscreen");
        this._zoomBtn.setAttribute("aria-label", "Zoom in");
        closeBtn.setAttribute("aria-label", "Close");
        event_handler_1.default.on(this._fullscreenBtn, EVENT_CLICK_DATA_API, () => this.toggleFullscreen());
        event_handler_1.default.on(this._zoomBtn, EVENT_CLICK_DATA_API, () => this._toggleZoom());
        event_handler_1.default.on(closeBtn, EVENT_CLICK_DATA_API, () => this.close());
        leftTools.append(this._imgCounter);
        rightTools.append(this._fullscreenBtn);
        rightTools.append(this._zoomBtn);
        rightTools.append(closeBtn);
        this._galleryToolbar.append(leftTools);
        this._galleryToolbar.append(rightTools);
        this._gallery.append(this._galleryToolbar);
    }
    _appendContent() {
        this._galleryContent = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._galleryContent, `${this._classes.galleryContent}`);
        this._gallery.append(this._galleryContent);
    }
    _appendLoader() {
        this._loader = (0, index_1.element)("div");
        const spinner = (0, index_1.element)("div");
        const spinnerContent = (0, index_1.element)("span");
        manipulator_1.default.addClass(this._loader, `${this._classes.loader}`);
        manipulator_1.default.addClass(spinner, `${this._classes.spinner}`);
        manipulator_1.default.addClass(spinnerContent, `${this._classes.spinnerContent}`);
        spinner.setAttribute("role", "status");
        spinnerContent.innerHTML = this.options.spinnerContent;
        spinner.append(spinnerContent);
        this._loader.append(spinner);
        this._gallery.append(this._loader);
    }
    _appendArrows() {
        this._leftArrowWrapper = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._leftArrowWrapper, `${this._classes.prevBtnWrapper}`);
        const leftArrow = (0, index_1.element)("button");
        leftArrow.setAttribute("aria-label", "Previous");
        manipulator_1.default.addClass(leftArrow, `${this._classes.prevBtn}`);
        event_handler_1.default.on(leftArrow, EVENT_CLICK_DATA_API, () => this.slide("left"));
        this._leftArrowWrapper.append(leftArrow);
        this._rightArrowWrapper = (0, index_1.element)("div");
        manipulator_1.default.addClass(this._rightArrowWrapper, `${this._classes.nextBtnWrapper}`);
        this._rightArrow = (0, index_1.element)("button");
        this._rightArrow.setAttribute("aria-label", "Next");
        manipulator_1.default.addClass(this._rightArrow, `${this._classes.nextBtn}`);
        event_handler_1.default.on(this._rightArrow, EVENT_CLICK_DATA_API, () => this.slide());
        this._rightArrowWrapper.append(this._rightArrow);
        this._rightArrow.innerHTML = this.options.nextIconTemplate;
        leftArrow.innerHTML = this.options.prevIconTemplate;
        this._getImages();
        if (this._images.length <= 1)
            return;
        this._gallery.append(this._leftArrowWrapper);
        this._gallery.append(this._rightArrowWrapper);
    }
    _appendCaption() {
        const captionWrapper = (0, index_1.element)("div");
        const caption = (0, index_1.element)("p");
        caption.setAttribute(ATTR_LIGHTBOX_CAPTION, "");
        manipulator_1.default.addClass(captionWrapper, `${this._classes.captionWrapper}`);
        manipulator_1.default.addClass(caption, `${this._classes.caption}`);
        captionWrapper.append(caption);
        this._gallery.append(captionWrapper);
    }
    _sortImages() {
        for (let i = 0; i < this._activeImg; i++) {
            this._images.push(this._images.shift());
        }
    }
    _loadImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const promiseArray = [];
            const imageArray = [];
            this._galleryContent.innerHTML = "";
            let positionLeft = 0;
            this._images.forEach((img, key) => {
                promiseArray.push(new Promise((resolve) => {
                    const newImg = new Image();
                    const newImgWrapper = (0, index_1.element)("div");
                    manipulator_1.default.addClass(newImgWrapper, `${this._classes.imgWrapper}`);
                    manipulator_1.default.addClass(newImg, `${this._classes.img}`);
                    this._addImgStyles(newImg, newImgWrapper, positionLeft, key, img);
                    newImgWrapper.append(newImg);
                    this._galleryContent.append(newImgWrapper);
                    newImg.onload = resolve;
                    newImg.src = img.dataset.teImg || img.src;
                    imageArray.push(newImg);
                    positionLeft += 100;
                }));
            });
            yield Promise.all(promiseArray);
            return imageArray;
        });
    }
    _addImgStyles(newImg, newImgWrapper, positionLeft, key, img) {
        newImg.alt = img.alt;
        newImg.draggable = false;
        manipulator_1.default.style(newImgWrapper, {
            position: "absolute",
            left: `${positionLeft}%`,
            top: 0,
        });
        if (img.dataset.teCaption || img.dataset.teCaption === "") {
            newImg.dataset.caption = img.dataset.teCaption;
        }
        if (positionLeft === 0) {
            if (img.width < img.height) {
                manipulator_1.default.addClass(newImg, `${this._classes.vertical}`);
            }
            manipulator_1.default.style(newImgWrapper, { opacity: 1 });
            newImg.setAttribute(ATTR_STATE_ACTIVE, "");
        }
        else {
            newImg.removeAttribute(ATTR_STATE_ACTIVE);
        }
        if (key === this._images.length - 1 && this._images.length > 1) {
            manipulator_1.default.style(newImgWrapper, { left: "-100%" });
        }
    }
    _resizeImages(images) {
        images.forEach((img) => {
            this._calculateImgSize(img);
        });
    }
    _calculateImgSize(img) {
        if (img.width >= img.height) {
            img.style.width = "100%";
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            img.style.top = `${(img.parentNode.offsetHeight - img.height) / 2}px`;
            img.style.left = 0;
        }
        else {
            img.style.height = "100%";
            img.style.maxHeight = "100%";
            img.style.width = "auto";
            img.style.left = `${(img.parentNode.offsetWidth - img.width) / 2}px`;
            img.style.top = 0;
        }
        if (img.width >= img.parentNode.offsetWidth) {
            img.style.width = `${img.parentNode.offsetWidth}px`;
            img.style.height = "auto";
            img.style.left = 0;
            img.style.top = `${(img.parentNode.offsetHeight - img.height) / 2}px`;
        }
        if (img.height >= img.parentNode.offsetHeight) {
            img.style.height = `${img.parentNode.offsetHeight}px`;
            img.style.width = "auto";
            img.style.top = 0;
            img.style.left = `${(img.parentNode.offsetWidth - img.width) / 2}px`;
        }
        this._positionX = parseFloat(img.style.left) || 0;
        this._positionY = parseFloat(img.style.top) || 0;
    }
    _onResize() {
        this._images = selector_engine_1.default.find("img", this._galleryContent);
        this._images.forEach((img) => {
            this._calculateImgSize(img);
        });
    }
    _onFullscreenChange() {
        const isFullscreenEnabled = document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement;
        if (isFullscreenEnabled === undefined) {
            this._fullscreen = false;
            this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate;
            this._fullscreenBtn.removeAttribute(ATTR_STATE_ACTIVE);
        }
    }
    _beforeSlideEvents() {
        this._animationStart();
        this._restoreDefaultZoom();
        this._restoreDefaultPosition();
        this._resetDoubleTap();
    }
    _slideHorizontally(direction) {
        this._images = selector_engine_1.default.find("img", this._galleryContent);
        this._images.forEach((img) => {
            let newPositionLeft;
            if (direction === "right") {
                newPositionLeft = parseInt(img.parentNode.style.left, 10) - 100;
                if (newPositionLeft < -100)
                    newPositionLeft = (this._images.length - 2) * 100;
            }
            else {
                newPositionLeft = parseInt(img.parentNode.style.left, 10) + 100;
                if (newPositionLeft === (this._images.length - 1) * 100)
                    newPositionLeft = -100;
            }
            this._slideImg(img, newPositionLeft);
        });
        this._updateActiveImg(direction);
    }
    _slideImg(img, position) {
        if (position === 0) {
            img.setAttribute(ATTR_STATE_ACTIVE, "");
            manipulator_1.default.style(img.parentNode, { opacity: 1, transform: "scale(1)" });
        }
        else {
            img.removeAttribute(ATTR_STATE_ACTIVE);
            manipulator_1.default.style(img.parentNode, {
                opacity: 0,
                transform: "scale(0.25)",
            });
        }
        img.parentNode.style.left = `${position}%`;
    }
    _slideToTarget(target) {
        if (target === "first" && this._activeImg === 0)
            return;
        if (target === "last" && this._activeImg === this._images.length - 1)
            return;
        this.reset();
        this._removeEvents();
        this._showLoader();
        this._getImages();
        this._activeImg = target === "first" ? 0 : this._images.length - 1;
        this._sortImages();
        manipulator_1.default.style(this.currentImg.parentNode, {
            transform: "scale(0.25)",
            opacity: 0,
        });
        setTimeout(() => {
            this._loadImages().then((images) => {
                this._resizeImages(images);
                this._addEvents();
                this._updateCaption();
                this._hideLoader();
                setTimeout(() => {
                    manipulator_1.default.style(this.currentImg.parentNode, {
                        transform: "scale(1)",
                        opacity: 1,
                    });
                }, 10);
            });
        }, 400);
    }
    _updateActiveImg(direction) {
        if (direction === "right") {
            if (this._activeImg === this._images.length - 1) {
                this._activeImg = 0;
            }
            else {
                this._activeImg++;
            }
        }
        if (direction === "left") {
            if (this._activeImg === 0) {
                this._activeImg = this._images.length - 1;
            }
            else {
                this._activeImg--;
            }
        }
    }
    _afterSlideEvents() {
        this._updateCounter();
        this._updateCaption();
    }
    _updateCounter() {
        if (this._images.length <= 1)
            return;
        setTimeout(() => {
            this._imgCounter.innerHTML = `${this._activeImg + 1} / ${this._images.length}`;
        }, 200);
    }
    _updateCaption() {
        setTimeout(() => {
            let caption = this.currentImg.alt;
            if (this.currentImg.dataset.caption ||
                this.currentImg.dataset.caption === "") {
                caption = this.currentImg.dataset.caption;
            }
            selector_engine_1.default.findOne(`[${ATTR_LIGHTBOX_CAPTION}]`, this._gallery).innerHTML = caption;
        }, 200);
    }
    _toggleTemplate() {
        if (this._gallery.style.visibility === "visible") {
            manipulator_1.default.style(this.currentImg.parentNode, {
                transform: "scale(0.25)",
            });
            setTimeout(() => {
                this._hideGallery();
                this._enableScroll();
                this._showLoader();
            }, 100);
        }
        else {
            this._showGallery();
            this._disableScroll();
            this._updateCounter();
            this._updateCaption();
            this._setToolsToggleTimout();
            this._hideLoader();
        }
    }
    _showLoader() {
        manipulator_1.default.style(this._loader, { opacity: 1 });
    }
    _hideLoader() {
        manipulator_1.default.style(this._loader, { opacity: 0 });
    }
    _hideGallery() {
        manipulator_1.default.style(this._gallery, {
            opacity: 0,
            pointerEvents: "none",
            visibility: "hidden",
        });
    }
    _showGallery() {
        manipulator_1.default.style(this._gallery, {
            opacity: 1,
            pointerEvents: "initial",
            visibility: "visible",
        });
        setTimeout(() => {
            manipulator_1.default.style(this.currentImg.parentNode, { transform: "scale(1)" });
        }, 50);
    }
    _toggleZoom() {
        if (this._zoom !== 1) {
            this.zoomOut();
        }
        else {
            this.zoomIn();
        }
    }
    _updateZoomBtn() {
        if (this._zoom > 1) {
            this._zoomBtn.setAttribute(ATTR_STATE_ACTIVE, "");
            this._zoomBtn.setAttribute("aria-label", "Zoom out");
            this._zoomBtn.innerHTML = this.options.zoomOutIconTemplate;
        }
        else {
            this._zoomBtn.removeAttribute(ATTR_STATE_ACTIVE);
            this._zoomBtn.setAttribute("aria-label", "Zoom in");
            this._zoomBtn.innerHTML = this.options.zoomInIconTemplate;
        }
    }
    _updateImgPosition() {
        if (this._zoom === 1) {
            this._restoreDefaultPosition();
        }
    }
    _addEvents() {
        const images = selector_engine_1.default.find("img", this._galleryContent);
        this._onWindowTouchmove = this._onWindowTouchmove.bind(this);
        this._onWindowTouchstart = this._onWindowTouchstart.bind(this);
        this._onImgMousedown = this._onMousedown.bind(this);
        this._onImgMousemove = this._onMousemove.bind(this);
        this._onImgWheel = this._onZoom.bind(this);
        this._onImgMouseup = this._onMouseup.bind(this);
        this._onImgTouchend = this._onTouchend.bind(this);
        this._onImgDoubleClick = this._onDoubleClick.bind(this);
        this._onWindowResize = this._onResize.bind(this);
        this._onWindowFullscreenChange = this._onFullscreenChange.bind(this);
        this._onAnyImgAction = this._resetToolsToggler.bind(this);
        this._onGalleryClick = this._onBackdropClick.bind(this);
        this._onKeyupEvent = this._onKeyup.bind(this);
        this._onRightArrowKeydownEvent = this._onRightArrowKeydown.bind(this);
        this._onFullscreenBtnKeydownEvent = this._onFullscreenBtnKeydown.bind(this);
        images.forEach((img) => {
            event_handler_1.default.on(img, "mousedown", this._onImgMousedown, {
                passive: true,
            });
            event_handler_1.default.on(img, "touchstart", this._onImgMousedown, {
                passive: true,
            });
            event_handler_1.default.on(img, "mousemove", this._onImgMousemove, {
                passive: true,
            });
            event_handler_1.default.on(img, "touchmove", this._onImgMousemove, {
                passive: true,
            });
            event_handler_1.default.on(img, "wheel", this._onImgWheel, { passive: true });
            event_handler_1.default.on(img, "dblclick", this._onImgDoubleClick, {
                passive: true,
            });
        });
        document.addEventListener("touchmove", this._onWindowTouchmove, {
            passive: false,
        });
        event_handler_1.default.on(window, "touchstart", this._onWindowTouchstart);
        event_handler_1.default.on(window, "mouseup", this._onImgMouseup);
        event_handler_1.default.on(window, "touchend", this._onImgTouchend);
        event_handler_1.default.on(window, "resize", this._onWindowResize);
        event_handler_1.default.on(window, "orientationchange", this._onWindowResize);
        event_handler_1.default.on(window, "keyup", this._onKeyupEvent);
        event_handler_1.default.on(window, "fullscreenchange", this._onWindowFullscreenChange);
        event_handler_1.default.on(this._gallery, "mousemove", this._onAnyImgAction);
        event_handler_1.default.on(this._gallery, "click", this._onGalleryClick);
        event_handler_1.default.on(this._rightArrow, "keydown", this._onRightArrowKeydownEvent);
        event_handler_1.default.on(this._fullscreenBtn, "keydown", this._onFullscreenBtnKeydownEvent);
    }
    _removeEvents() {
        const images = selector_engine_1.default.find("img", this._galleryContent);
        images.forEach((img) => {
            event_handler_1.default.off(img, "mousedown", this._onImgMousedown);
            event_handler_1.default.off(img, "touchstart", this._onImgMousedown);
            event_handler_1.default.off(img, "mousemove", this._onImgMousemove);
            event_handler_1.default.off(img, "touchmove", this._onImgMousemove);
            event_handler_1.default.off(img, "wheel", this._onImgWheel);
            event_handler_1.default.off(img, "dblclick", this._onImgDoubleClick);
        });
        document.removeEventListener("touchmove", this._onWindowTouchmove, {
            passive: false,
        });
        event_handler_1.default.off(window, "touchstart", this._onWindowTouchstart);
        event_handler_1.default.off(window, "mouseup", this._onImgMouseup);
        event_handler_1.default.off(window, "touchend", this._onImgTouchend);
        event_handler_1.default.off(window, "resize", this._onWindowResize);
        event_handler_1.default.off(window, "orientationchange", this._onWindowResize);
        event_handler_1.default.off(window, "keyup", this._onKeyupEvent);
        event_handler_1.default.off(window, "fullscreenchange", this._onWindowFullscreenChange);
        event_handler_1.default.off(this._gallery, "mousemove", this._onAnyImgAction);
        event_handler_1.default.off(this._gallery, "click", this._onGalleryClick);
        event_handler_1.default.off(this._rightArrow, "keydown", this._onRightArrowKeydownEvent);
        event_handler_1.default.off(this._fullscreenBtn, "keydown", this._onFullscreenBtnKeydownEvent);
    }
    _onMousedown(e) {
        const touch = e.touches;
        const x = touch ? touch[0].clientX : e.clientX;
        const y = touch ? touch[0].clientY : e.clientY;
        this._originalPositionX = parseFloat(this.currentImg.style.left) || 0;
        this._originalPositionY = parseFloat(this.currentImg.style.top) || 0;
        this._positionX = this._originalPositionX;
        this._positionY = this._originalPositionY;
        this._mousedownPositionX = x * (1 / this._zoom) - this._positionX;
        this._mousedownPositionY = y * (1 / this._zoom) - this._positionY;
        this._mousedown = true;
        if (e.type === "touchstart") {
            if (e.touches.length > 1) {
                this._multitouch = true;
                this._touchZoomPosition = e.touches;
            }
        }
    }
    _onMousemove(e) {
        if (!this._mousedown)
            return;
        const touch = e.touches;
        const x = touch ? touch[0].clientX : e.clientX;
        const y = touch ? touch[0].clientY : e.clientY;
        if (touch)
            this._resetToolsToggler();
        if (!this._multitouch) {
            if (this._zoom !== 1) {
                this._positionX = x * (1 / this._zoom) - this._mousedownPositionX;
                this._positionY = y * (1 / this._zoom) - this._mousedownPositionY;
                manipulator_1.default.style(this.currentImg, {
                    left: `${this._positionX}px`,
                    top: `${this._positionY}px`,
                });
            }
            else {
                if (this._images.length <= 1)
                    return;
                this._positionX = x * (1 / this._zoom) - this._mousedownPositionX;
                manipulator_1.default.style(this.currentImg, { left: `${this._positionX}px` });
            }
        }
    }
    _onMouseup(e) {
        this._mousedown = false;
        this._moveImg(e.target);
    }
    _onTouchend(e) {
        this._mousedown = false;
        if (this._multitouch) {
            if (e.targetTouches.length === 0) {
                this._multitouch = false;
                this._touchZoomPosition = [];
            }
        }
        else if (!this._multitouch) {
            this._checkDoubleTap(e);
            this._moveImg(e.target);
        }
    }
    _calculateTouchZoom(e) {
        const initialDistance = Math.hypot(this._touchZoomPosition[1].pageX - this._touchZoomPosition[0].pageX, this._touchZoomPosition[1].pageY - this._touchZoomPosition[0].pageY);
        const finalDistance = Math.hypot(e.touches[1].pageX - e.touches[0].pageX, e.touches[1].pageY - e.touches[0].pageY);
        const distanceChange = Math.abs(initialDistance - finalDistance);
        const screenWidth = e.view.screen.width;
        if (distanceChange > screenWidth * 0.03) {
            if (initialDistance <= finalDistance) {
                this.zoomIn();
            }
            else {
                this.zoomOut();
            }
            this._touchZoomPosition = e.touches;
        }
    }
    _onWindowTouchstart(e) {
        if (e.touches.length > 1) {
            this._multitouch = true;
            this._touchZoomPosition = e.touches;
        }
    }
    _onWindowTouchmove(e) {
        e.preventDefault();
        if (e.type === "touchmove" && e.targetTouches.length > 1) {
            this._calculateTouchZoom(e);
        }
    }
    _onRightArrowKeydown(e) {
        switch (e.keyCode) {
            case 9:
                if (e.shiftKey)
                    break;
                e.preventDefault();
                this._focusFullscreenBtn();
                break;
            default:
                break;
        }
    }
    _onFullscreenBtnKeydown(e) {
        switch (e.keyCode) {
            case 9:
                if (!e.shiftKey)
                    break;
                e.preventDefault();
                this._focusRightArrow();
                break;
            default:
                break;
        }
    }
    _onKeyup(e) {
        this._resetToolsToggler();
        switch (e.keyCode) {
            case 39:
                this.slide();
                break;
            case 37:
                this.slide("left");
                break;
            case 27:
                this.close();
                break;
            case 36:
                this.slide("first");
                break;
            case 35:
                this.slide("last");
                break;
            case 38:
                this.zoomIn();
                break;
            case 40:
                this.zoomOut();
                break;
            default:
                break;
        }
    }
    _focusFullscreenBtn() {
        setTimeout(() => {
            this._fullscreenBtn.focus();
        }, 100);
    }
    _focusRightArrow() {
        this._rightArrow.focus();
    }
    _moveImg(target) {
        if (this._multitouch)
            return;
        if (this._zoom !== 1 ||
            target !== this.currentImg ||
            this._images.length <= 1)
            return;
        const movement = this._positionX - this._originalPositionX;
        if (movement > 0) {
            this.slide("left");
        }
        else if (movement < 0) {
            this.slide();
        }
    }
    _checkDoubleTap(e) {
        clearTimeout(this._doubleTapTimer);
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this._tapTime;
        if (this._tapCounter > 0 && tapLength < 500) {
            this._onDoubleClick(e);
            this._doubleTapTimer = setTimeout(() => {
                this._tapTime = new Date().getTime();
                this._tapCounter = 0;
            }, 300);
        }
        else {
            this._tapCounter++;
            this._tapTime = new Date().getTime();
        }
    }
    _resetDoubleTap() {
        this._tapTime = 0;
        this._tapCounter = 0;
        clearTimeout(this._doubleTapTimer);
    }
    _onDoubleClick(e) {
        if (this._multitouch)
            return;
        if (!e.touches)
            this._setNewPositionOnZoomIn(e);
        if (this._zoom !== 1) {
            this._restoreDefaultZoom();
        }
        else {
            this.zoomIn();
        }
    }
    _onZoom(e) {
        if (e.deltaY > 0) {
            this.zoomOut();
        }
        else {
            if (this._zoom >= 3)
                return;
            this._setNewPositionOnZoomIn(e);
            this.zoomIn();
        }
    }
    _onBackdropClick(e) {
        this._resetToolsToggler();
        if (e.target.tagName !== "DIV")
            return;
        this.close();
    }
    _setNewPositionOnZoomIn(e) {
        clearTimeout(this._zoomTimer);
        this._positionX = window.innerWidth / 2 - e.offsetX - 50;
        this._positionY = window.innerHeight / 2 - e.offsetY - 50;
        this.currentImg.style.transition = "all 0.5s ease-out";
        this.currentImg.style.left = `${this._positionX}px`;
        this.currentImg.style.top = `${this._positionY}px`;
        this._zoomTimer = setTimeout(() => {
            this.currentImg.style.transition = "none";
        }, 500);
    }
    _resetToolsToggler() {
        this._showTools();
        clearTimeout(this._toolsToggleTimer);
        this._setToolsToggleTimout();
    }
    _setToolsToggleTimout() {
        this._toolsToggleTimer = setTimeout(() => {
            this._hideTools();
            clearTimeout(this._toolsToggleTimer);
        }, 4000);
    }
    _hideTools() {
        manipulator_1.default.style(this._galleryToolbar, { opacity: 0 });
        manipulator_1.default.style(this._leftArrowWrapper, { opacity: 0 });
        manipulator_1.default.style(this._rightArrowWrapper, { opacity: 0 });
    }
    _showTools() {
        manipulator_1.default.style(this._galleryToolbar, { opacity: 1 });
        manipulator_1.default.style(this._leftArrowWrapper, { opacity: 1 });
        manipulator_1.default.style(this._rightArrowWrapper, { opacity: 1 });
    }
    _disableScroll() {
        manipulator_1.default.addClass(document.body, `overflow-y-hidden relative`);
        if (document.documentElement.scrollHeight >
            document.documentElement.clientHeight) {
            manipulator_1.default.addClass(document.body, `md:pr-[17px]`);
        }
    }
    _enableScroll() {
        setTimeout(() => {
            manipulator_1.default.removeClass(document.body, `overflow-y-hidden relative`);
            manipulator_1.default.removeClass(document.body, `md:pr-[17px]`);
        }, 300);
    }
    _animationStart() {
        this._animating = true;
        setTimeout(() => {
            this._animating = false;
        }, 400);
    }
    _restoreDefaultZoom() {
        if (this._zoom !== 1) {
            this._zoom = 1;
            manipulator_1.default.style(this.currentImg.parentNode, {
                transform: `scale(${this._zoom})`,
            });
            this._updateZoomBtn();
            this._updateImgPosition();
        }
    }
    _restoreDefaultFullscreen() {
        if (this._fullscreen)
            this.toggleFullscreen();
    }
    _restoreDefaultPosition() {
        clearTimeout(this._zoomTimer);
        const currentImg = this.currentImg;
        manipulator_1.default.style(this.currentImg.parentNode, { left: 0, top: 0 });
        manipulator_1.default.style(this.currentImg, {
            transition: "all 0.5s ease-out",
            left: 0,
            top: 0,
        });
        this._calculateImgSize(currentImg);
        setTimeout(() => {
            manipulator_1.default.style(this.currentImg, { transition: "none" });
        }, 500);
    }
    _triggerEvents(startEvent, completeEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            event_handler_1.default.trigger(this._element, `${startEvent}.te.lightbox`);
            if (completeEvent) {
                yield setTimeout(() => {
                    event_handler_1.default.trigger(this._element, `${completeEvent}.te.lightbox`);
                }, 505);
            }
        });
    }
    static getInstance(element) {
        return data_1.default.getData(element, DATA_KEY);
    }
    static getOrCreateInstance(element, config = {}) {
        return (this.getInstance(element) ||
            new this(element, typeof config === "object" ? config : null));
    }
    static toggle() {
        return function (event) {
            const lightbox = selector_engine_1.default.closest(event.target, `${SELECTOR_ATTR_LIGHTBOX}`);
            const instance = Lightbox.getInstance(lightbox) || new Lightbox(lightbox);
            instance.open(event);
        };
    }
    static jQueryInterface(config, options) {
        return this.each(function () {
            let data = data_1.default.getData(this, DATA_KEY);
            const _config = typeof config === "object" && config;
            if (!data && /dispose/.test(config)) {
                return;
            }
            if (!data) {
                data = new Lightbox(this, _config);
            }
            if (typeof config === "string") {
                if (typeof data[config] === "undefined") {
                    throw new TypeError(`No method named "${config}"`);
                }
                data[config](options);
            }
        });
    }
}
exports.default = Lightbox;
//# sourceMappingURL=lightbox.js.map