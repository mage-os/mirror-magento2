/*eslint-disable */
define(["knockout", "mageUtils", "uiEvents", "underscore", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/stage", "Magento_PageBuilder/js/component/stage/panel"], function (_knockout, _mageUtils, _uiEvents, _underscore, _config, _stage, _panel) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PageBuilder =
  /*#__PURE__*/
  function () {
    function PageBuilder(config, initialValue) {
      this.template = "Magento_PageBuilder/component/page-builder.html";
      this.panel = void 0;
      this.stage = void 0;
      this.config = void 0;
      this.initialValue = void 0;
      this.id = _mageUtils.uniqueid();
      this.originalScrollTop = 0;
      this.isFullScreen = _knockout.observable(false);
      this.loading = _knockout.observable(true);

      _config.setConfig(config);

      this.initialValue = initialValue;
      this.isFullScreen(config.isFullScreen);
      this.config = config;
      this.stage = new _stage(this);
      this.panel = new _panel(this);
      this.initListeners();
    }
    /**
     * Init listeners.
     */


    var _proto = PageBuilder.prototype;

    _proto.initListeners = function initListeners() {
      var _this = this;

      _uiEvents.on("pagebuilder:toggleFullScreen:" + this.id, function () {
        return _this.toggleFullScreen();
      });

      this.isFullScreen.subscribe(function () {
        return _this.onFullScreenChange();
      });
    };
    /**
     * Tells the stage wrapper to expand to fullScreen
     */


    _proto.toggleFullScreen = function toggleFullScreen() {
      this.isFullScreen(!this.isFullScreen());
    };
    /**
     * Change window scroll base on full screen mode.
     */


    _proto.onFullScreenChange = function onFullScreenChange() {
      var _this2 = this;

      if (this.isFullScreen()) {
        this.originalScrollTop = window.scrollY;

        _underscore.defer(function () {
          window.scroll(0, 0);
        });
      } else {
        _underscore.defer(function () {
          window.scroll(0, _this2.originalScrollTop);
        });
      }

      _uiEvents.trigger("pagebuilder:fullScreen:" + this.id, {
        fullScreen: this.isFullScreen()
      });
    };
    /**
     * Get template.
     *
     * @returns {string}
     */


    _proto.getTemplate = function getTemplate() {
      return this.template;
    };

    return PageBuilder;
  }();

  return PageBuilder;
});
//# sourceMappingURL=page-builder.js.map
