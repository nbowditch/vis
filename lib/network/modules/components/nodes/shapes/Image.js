'use strict';

import CircleImageBase from '../util/CircleImageBase'

class Image extends CircleImageBase {
  constructor (options, body, labelModule, imageObj) {
    super(options, body, labelModule);
    this.imageObj = imageObj;
  }

  resize() {
    this._resizeImage();
  }

  draw(ctx, x, y, selected, hover) {
    this.resize();
    this.left = x - this.width / 2;
    this.top = y - this.height / 2;

    if (this.options.shapeProperties.useBorderWithImage === true) {
      let borderWidth = this.options.borderWidth;

      let selectionLineWidth = this.options.borderWidthSelected || 2 * this.options.borderWidth;

      ctx.beginPath();

      // setup the line properties.
      ctx.strokeStyle = selected ? this.options.color.highlight.border : hover ? this.options.color.hover.border : this.options.color.border;
      ctx.lineWidth = (selected ? selectionLineWidth : borderWidth);
      ctx.lineWidth /= this.body.view.scale;
      ctx.lineWidth = Math.min(this.width, ctx.lineWidth);

      // set a fillstyle
      ctx.fillStyle = selected ? this.options.color.highlight.background : hover ? this.options.color.hover.background : this.options.color.background;

      // draw a rectangle to form the border around. This rectangle is filled so the opacity of a picture (in future vis releases?) can be used to tint the image
      ctx.rect(this.left - 0.5 * ctx.lineWidth,
        this.top - 0.5 * ctx.lineWidth,
        this.width + ctx.lineWidth,
        this.height + ctx.lineWidth);
      ctx.fill();

      //draw dashed border if enabled, save and restore is required for firefox not to crash on unix.
      ctx.save();
      this.enableBorderDashes(ctx);
      //draw the border
      ctx.stroke();
      //disable dashed border for other elements
      this.disableBorderDashes(ctx);
      ctx.restore();

      ctx.closePath();
    }

    this._drawImageAtPosition(ctx);

    this._drawImageLabel(ctx, x, y, selected || hover);

    this.updateBoundingBox(x,y);
  }

  updateBoundingBox(x,y) {
    this.resize();
    this.left = x - this.width / 2;
    this.top = y - this.height / 2;

    this.boundingBox.top = this.top;
    this.boundingBox.left = this.left;
    this.boundingBox.right = this.left + this.width;
    this.boundingBox.bottom = this.top + this.height;

    if (this.options.label !== undefined && this.labelModule.size.width > 0) {
      this.boundingBox.left = Math.min(this.boundingBox.left, this.labelModule.size.left);
      this.boundingBox.right = Math.max(this.boundingBox.right, this.labelModule.size.left + this.labelModule.size.width);
      this.boundingBox.bottom = Math.max(this.boundingBox.bottom, this.boundingBox.bottom + this.labelOffset);
    }
  }

  distanceToBorder(ctx, angle) {
    this.resize(ctx);
    var a = this.width / 2;
    var b = this.height / 2;
    var w = (Math.sin(angle) * a);
    var h = (Math.cos(angle) * b);
    return a * b / Math.sqrt(w * w + h * h);
  }
}

export default Image;