/*eslint-disable */
/* jscs:disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/utils/delay-until", "Magento_PageBuilder/js/utils/editor", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _events, _underscore, _hideShowOption, _delayUntil, _editor, _factory, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _preview2.call.apply(_preview2, [this].concat(args)) || this;
      _this.wysiwygDeferred = _jquery.Deferred();
      _this.handledDoubleClick = false;
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * @returns {Boolean}
     */
    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return (0, _editor.isWysiwygSupported)();
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * @param {HTMLElement} element
     */
    ;

    _proto.afterRenderWysiwyg = function afterRenderWysiwyg(element) {
      this.element = element;
      element.id = this.contentType.id + "-editor";
      /**
       * afterRenderWysiwyg is called whenever Knockout causes a DOM re-render. This occurs frequently within Slider
       * due to Slick's inability to perform a refresh with Knockout managing the DOM. Due to this the original
       * WYSIWYG instance will be detached from this slide and we need to re-initialize on click.
       */

      this.wysiwyg = null;
    }
    /**
     * Stop event to prevent execution of action when editing textarea.
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    ;

    _proto.stopEvent = function stopEvent(preview, event) {
      event.stopPropagation();
      return true;
    }
    /**
     * Init the WYSIWYG
     *
     * @param {boolean} focus Should wysiwyg focus after initialization?
     * @returns Promise
     */
    ;

    _proto.initWysiwyg = function initWysiwyg(focus) {
      var _this2 = this;

      if (focus === void 0) {
        focus = false;
      }

      if (this.wysiwyg) {
        return;
      }

      var wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;

      if (focus) {
        wysiwygConfig.adapter.settings.auto_focus = this.element.id;

        wysiwygConfig.adapter.settings.init_instance_callback = function () {
          _underscore.defer(function () {
            _this2.element.blur();

            _this2.element.focus();
          });
        };
      }

      return (0, _factory)(this.contentType.id, this.element.id, this.config.name, wysiwygConfig, this.contentType.dataStore, "content", this.contentType.stageId).then(function (wysiwyg) {
        _this2.wysiwyg = wysiwyg;
      });
    }
    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    ;

    _proto.activateEditor = function activateEditor(preview, event) {
      var _this3 = this;

      if (this.element && !this.wysiwyg && !this.handledDoubleClick) {
        var bookmark = (0, _editor.createBookmark)(event);
        (0, _editor.lockImageSize)(this.element);
        this.element.removeAttribute("contenteditable");

        _underscore.defer(function () {
          _this3.initWysiwyg(true).then(function () {
            return (0, _delayUntil)(function () {
              _this3.wysiwygDeferred.resolve();

              (0, _editor.moveToBookmark)(bookmark);
              (0, _editor.unlockImageSize)(_this3.element);
            }, function () {
              return _this3.element.classList.contains("mce-edit-focus");
            }, 10);
          }).catch(function (error) {
            // If there's an error with init of WYSIWYG editor push into the console to aid support
            console.error(error);
          });
        });
      }
    }
    /**
     * If a user double clicks prior to initializing TinyMCE, forward the event
     *
     * @param preview
     * @param event
     */
    ;

    _proto.handleDoubleClick = function handleDoubleClick(preview, event) {
      var _this4 = this;

      if (this.handledDoubleClick) {
        return;
      }

      event.preventDefault();
      var targetIndex = (0, _editor.findNodeIndex)(this.element, event.target.tagName, event.target);
      this.handledDoubleClick = true;
      this.wysiwygDeferred.then(function () {
        var target = document.getElementById(event.target.id);

        if (!target) {
          target = (0, _editor.getNodeByIndex)(_this4.element, event.target.tagName, targetIndex);
        }

        if (target) {
          var dblClickEvent = new MouseEvent("dblclick", {
            view: window,
            bubbles: true,
            cancelable: true
          });
          target.dispatchEvent(dblClickEvent);
        }
      });
    }
    /**
     * @param {HTMLTextAreaElement} element
     */
    ;

    _proto.initTextarea = function initTextarea(element) {
      var _this5 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.contentType.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.contentType.id + ":saveAfter", function () {
        _this5.textarea.value = _this5.contentType.dataStore.get("content");

        _this5.adjustTextareaHeightBasedOnScrollHeight();
      });
    }
    /**
     * Save current value of textarea in data store
     */
    ;

    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.contentType.dataStore.set("content", this.textarea.value);
    }
    /**
     * Start stage interaction on textarea blur
     */
    ;

    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    }
    /**
     * Stop stage interaction on textarea blur
     */
    ;

    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    }
    /**
     * Retrieve the margin & padding & alignment styles for the placeholder
     *
     * @returns {any}
     */
    ;

    _proto.getPlaceholderStyle = function getPlaceholderStyle() {
      var keys = ["marginBottom", "marginLeft", "marginRight", "marginTop", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textAlign"];
      return _underscore.pick(this.data.main.style(), function (style, key) {
        return keys.indexOf(key) !== -1;
      });
    }
    /**
     * Adjust textarea's height based on scrollHeight
     */
    ;

    _proto.adjustTextareaHeightBasedOnScrollHeight = function adjustTextareaHeightBasedOnScrollHeight() {
      this.textarea.style.height = "";
      var scrollHeight = this.textarea.scrollHeight;
      var minHeight = parseInt((0, _jquery)(this.textarea).css("min-height"), 10);

      if (scrollHeight === minHeight) {
        // leave height at 'auto'
        return;
      }

      (0, _jquery)(this.textarea).height(scrollHeight);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map