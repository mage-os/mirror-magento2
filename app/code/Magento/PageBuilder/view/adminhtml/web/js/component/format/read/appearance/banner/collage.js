/*eslint-disable */
define(["../../../../../utils/color-converter", "../../../../../utils/extract-alpha-from-rgba", "../../../../../utils/image"], function (_colorConverter, _extractAlphaFromRgba, _image) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Collage =
  /*#__PURE__*/
  function () {
    function Collage() {}

    var _proto = Collage.prototype;

    /**
     * Read background from the element
     * Reuse default reader logic to point at mobile version
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var mobileImage = "";
      var target = element.querySelector("a").getAttribute("target");
      var backgroundImage = element.querySelector(".pagebuilder-mobile-hidden").style.backgroundImage;
      var backgroundMobileImageElement = element.querySelector(".pagebuilder-mobile-only");

      if (backgroundMobileImageElement !== undefined && backgroundMobileImageElement.style.backgroundImage !== "" && backgroundImage !== backgroundMobileImageElement.style.backgroundImage) {
        mobileImage = (0, _image.decodeUrl)(backgroundMobileImageElement.style.backgroundImage);
      }

      var overlayColor = element.querySelector(".pagebuilder-overlay").getAttribute("data-overlay-color");
      var paddingSrc = element.querySelector(".pagebuilder-mobile-only").style;
      var marginSrc = element.style;
      var response = {
        background_image: (0, _image.decodeUrl)(backgroundImage),
        background_size: element.style.backgroundSize,
        button_text: element.dataset.buttonText,
        link_url: element.querySelector("a").getAttribute("href"),
        margins_and_padding: {
          margin: {
            bottom: marginSrc.marginBottom.replace("px", ""),
            left: marginSrc.marginLeft.replace("px", ""),
            right: marginSrc.marginRight.replace("px", ""),
            top: marginSrc.marginTop.replace("px", "")
          },
          padding: {
            bottom: paddingSrc.paddingBottom.replace("px", ""),
            left: paddingSrc.paddingLeft.replace("px", ""),
            right: paddingSrc.paddingRight.replace("px", ""),
            top: paddingSrc.paddingTop.replace("px", "")
          }
        },
        message: element.querySelector(".pagebuilder-collage-content div").innerHTML,
        min_height: parseInt(element.querySelector(".pagebuilder-banner-wrapper").style.minHeight, 10),
        mobile_image: mobileImage,
        open_in_new_tab: target && target === "_blank" ? "1" : "0",
        overlay_color: this.getOverlayColor(overlayColor),
        overlay_transparency: this.getOverlayTransparency(overlayColor),
        show_button: element.getAttribute("data-show-button"),
        show_overlay: element.getAttribute("data-show-overlay")
      };
      return Promise.resolve(response);
    };
    /**
     * Get overlay color
     *
     * @returns string
     */


    _proto.getOverlayColor = function getOverlayColor(value) {
      return value === "transparent" ? "" : (0, _colorConverter.toHex)(value);
    };
    /**
     * Get overlay transparency
     *
     * @returns string
     */


    _proto.getOverlayTransparency = function getOverlayTransparency(value) {
      return value === "transparent" ? "0" : (0, _extractAlphaFromRgba)(value);
    };

    return Collage;
  }();

  return Collage;
});
//# sourceMappingURL=collage.js.map
