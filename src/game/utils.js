const drawText = require('node-canvas-text').default;
const opentype = require('opentype.js');

class RenderUtils
{
  constructor() { }

  static radiusInRect(rect) {
    // the sides cannot be negative
    if (rect.width < 0 || rect.height < 0)
      return -1;
 
    // Return the radius
    return Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2;
  }

  static loadFont(url) {
    return opentype.loadSync(url);
  }

  static drawText(context, text, font, rect, options)
  {
    options = options || {};
    options.textPadding = options.textPadding || -5;
    options.minSize = options.minSize || 5;
    options.maxSize = options.maxSize || 100;
    options.vAlign = options.vAlign || 'center';
    options.hAlign = options.hAlign || 'center';
    options.fitMethod = options.fitMethod || 'baseline';
    options.textFillStyle = options.textFillStyle || 'rgba(255,255,255,0.8)';
    drawText(context, text, font, rect, options);
  }

  static roundRect(context, x, y, width, height, radius)
  {
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = {
        tl: radius,
        tr: radius,
        br: radius,
        bl: radius
      };
    } else {
      var defaultRadius = {
        tl: 0,
        tr: 0,
        br: 0,
        bl: 0
      };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
  }

  static drawProgressBar(context, rect, min, max, value, options)
  {
    options = options || {};
    context.save();

    // Draw background
    context.fillStyle = options.fillStyleBackground || 'rgba(32, 32, 32, 0.05)';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
    
    // Draw progress
    let progress = (value - min) / (max - min);
    let progressRect = {
      x: rect.x, y: rect.y,
      width: rect.width * progress,
      height: rect.height
    }
    context.fillStyle = options.fillStyle || 'rgba(255, 0, 0, 0.6)';
    context.fillRect(progressRect.x, progressRect.y, progressRect.width, progressRect.height);

    // Draw outline
    context.fillStyle = options.strokeStyle || 'rgba(64, 0, 0, 0.8)';
    context.rect(rect.x, rect.y, rect.width, rect.height);
    //context.stroke();

    // Draw text
    if(options.font)
    {
      RenderUtils.drawText(
        context,
        Math.round(value - min) + "/" + Math.round(max - min) + " (" + Math.round(progress * 100) + "%)",
        options.font, rect, options.textOptions
      );
    }

    context.restore();
  }
  
  static drawGrid(context)
  {
    let x = 0;
    let y = 0;

    context.save();
    context.globalAlpha = 0.9;
    context.strokeStyle = '#000000';
    for (x = 0; x <= context.canvas.width; x += 100) {
      context.moveTo(x, 0);
      context.lineTo(x, context.canvas.height);
      for (y = 0; y <= context.canvas.height; y += 100) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
    }
    context.stroke();
    //context.restore();

    context.save();
    context.globalAlpha = 0.66667;
    context.strokeStyle = '#7f7f7f';
    for (x = 0; x <= context.canvas.width; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, context.canvas.height);
      for (y = 0; y <= context.canvas.height; y += 10) {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width, y);
      }
    }
    context.stroke();
    context.restore();
  }
};

module.exports = { RenderUtils };