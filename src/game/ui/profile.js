const { config } = require('../../config');
const { Player } = require('../entity/player');
const { RenderUtils } = require('../utils');
const Canvas = require('node-canvas');
const drawText = require('node-canvas-text').default;
const opentype = require('opentype.js');

let font_ancientModernTales = opentype.loadSync(__dirname + '/../../../fonts/AncientModernTales-a7Po.ttf');

// Profile rects
let _rects = {};
_rects.Canvas = {
  x: 0, y: 0,
  width:  config("PROFILE_CANVAS_WIDTH"),
  height: config("PROFILE_CANVAS_HEIGHT")
};
_rects.Header = {
  x: 15, y: 15,
  width:  _rects.Canvas.width - 30,
  height: 120
}
_rects.Header.Avatar = {
  x: _rects.Header.x + 10,
  y: _rects.Header.y + 10,
  width:  _rects.Header.height - 20,
  height: _rects.Header.height - 20
}
_rects.Header.Name = {
  x: _rects.Header.Avatar.x + _rects.Header.Avatar.width + 10,
  y: _rects.Header.Avatar.y,
  width:  _rects.Header.width - (_rects.Header.Avatar.width + _rects.Header.Avatar.x + 10),
  height: _rects.Header.Avatar.height
}

// Profile class
class Profile
{
  constructor(member, player, background)
  {
    this.rects = Object.freeze(_rects);
    this.member = member;
    this.player = player || new Player();
    //this.background = background || __dirname + "/../../../images/bg.jpg";
    this.background = background || 'https://cdn.akamai.steamstatic.com/steam/apps/799960/ss_741b909d39573968d3ef72ba2c11836bd8e24478.1920x1080.jpg?t=1618937889'
  }

  setBackground(uri) {
    this.bg = uri;
  }

  async renderHeader(context)
  {
    context.save();
    
    // Clip to a rounded rectangle
    RenderUtils.roundRect(context,
      this.rects.Header.x, this.rects.Header.y,
      this.rects.Header.width, this.rects.Header.height, 10
    );
    context.clip();

    // draw gradient bg in header
    let grd = context.createLinearGradient(
      this.rects.Header.x, this.rects.Header.y,
      this.rects.Header.width, this.rects.Header.height
    );
    grd.addColorStop(0, "rgba(0,0,0,0.6)");
    grd.addColorStop(0.33333, "rgba(128,128,128,0.8)");
    grd.addColorStop(0.66667, "rgba(255,255,255,0.33)");
    grd.addColorStop(1, "rgba(255,255,255,0.05)");
    context.fillStyle = grd;
    context.fillRect(
      this.rects.Header.x, this.rects.Header.y,
      this.rects.Header.width, this.rects.Header.height
    );

    // Draw name outline in header
    context.save();
    context.beginPath();
    context.globalAlpha = 0.9;
    context.strokeStyle = '#000000';
    context.moveTo(this.rects.Header.Name.x, this.rects.Header.Name.y);
    context.lineTo(
      this.rects.Header.Name.x + this.rects.Header.Name.width,
      this.rects.Header.Name.y
    );
    context.moveTo(this.rects.Header.Name.x, this.rects.Header.Name.y + this.rects.Header.Name.height);
    context.lineTo(
      this.rects.Header.Name.x + this.rects.Header.Name.width,
      this.rects.Header.Name.y + this.rects.Header.Name.height
    );
    // context.rect(
    //   this.rects.Header.Name.x,
    //   this.rects.Header.Name.y,
    //   this.rects.Header.Name.width,
    //   this.rects.Header.Name.height
    // );
    context.stroke();
    context.restore();

    // Draw player name in header
    let angle = RenderUtils.radiusInRect(this.rects.Header.Avatar) * 0.7071;
    drawText(context, this.player.name, font_ancientModernTales, this.rects.Header.Name, {
      minSize: 5,
      maxSize: 100,
      vAlign: 'center',
      hAlign: 'center',
      fitMethod: 'baseline',
      textFillStyle: "#ffffff"
    });
    
    // draw player avatar in header
    context.beginPath();
    context.arc(75, 75, angle, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await Canvas.loadImage(this.member.user.avatarURL({ format: 'jpg' }));
    context.drawImage(
      avatar, this.rects.Header.Avatar.x,
      this.rects.Header.Avatar.y,
      this.rects.Header.Avatar.width,
      this.rects.Header.Avatar.height
    );

    context.restore();
  }

  async render(context)
  {
    // Draw the background
    context.strokeRect(0, 0, this.rects.Canvas.width, this.rects.Canvas.height);
    const background = await Canvas.loadImage(this.background);
    context.drawImage(background, 0, 0, this.rects.Canvas.width, this.rects.Canvas.height);

    // Draw grid
    //RenderUtils.drawGrid(context);

    // Draw the header
    await this.renderHeader(context);

    // Draw player stats

    // Draw player attributes
  }
};

module.exports = { Profile };