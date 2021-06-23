import { conf } from '../../conf.js';
import { Player } from '../entity/player.js';
import { RenderUtils } from '../utils.js';
import Canvas from 'node-canvas';

// Profile rects
let _rects = {};
_rects.Canvas = {
  x: 0, y: 0,
  width:  conf("PROFILE_CANVAS_WIDTH"),
  height: conf("PROFILE_CANVAS_HEIGHT")
};
_rects.Header = {
  x: 15, y: 15,
  width:  _rects.Canvas.width - 30,
  height: 120
};
_rects.Header.Avatar = {
  x: _rects.Header.x + 10,
  y: _rects.Header.y + 10,
  width:  _rects.Header.height - 20,
  height: _rects.Header.height - 20
};
_rects.Header.Name = {
  x: _rects.Header.Avatar.x + _rects.Header.Avatar.width + 10,
  y: _rects.Header.Avatar.y,
  width:  _rects.Header.width - (_rects.Header.Avatar.width + _rects.Header.Avatar.x + 10),
  height: _rects.Header.Avatar.height
};
_rects.Stats = {
  x: 15, y: _rects.Header.y + _rects.Header.height + 15,
  width: (_rects.Header.width / 2) + 7.5 - 15,
  height: _rects.Canvas.height - (_rects.Header.y + _rects.Header.height + 30)
};
_rects.Stats.Inner = {
  x: _rects.Stats.x + 15, y: _rects.Stats.y + 15,
  width: _rects.Stats.width - 30,
  height: _rects.Stats.height - 30
};
_rects.Attributes = {
  x: _rects.Stats.x + _rects.Stats.width + 15, y: _rects.Stats.y,
  width: _rects.Stats.width,
  height: _rects.Stats.height
};
_rects.Attributes.Inner = {
  x: _rects.Attributes.x + 15, y: _rects.Attributes.y + 15,
  width: _rects.Attributes.width - 30,
  height: _rects.Attributes.height - 30
};

_rects.Stats.Inner.Rows = [{},{},{},{},{},{},{},{}];
let innerRowHeight = _rects.Stats.Inner.height / _rects.Stats.Inner.Rows.length;
for (let row = 0; row < _rects.Stats.Inner.Rows.length; row++)
{
  _rects.Stats.Inner.Rows[row] = {
    x: _rects.Stats.Inner.x,
    y: _rects.Stats.Inner.y + (innerRowHeight * row),
    width: _rects.Stats.Inner.width,
    height: innerRowHeight
  };
};

// Player Level
_rects.Stats.Inner.Rows[0].Icon = {
  x: _rects.Stats.Inner.Rows[0].x,
  y: _rects.Stats.Inner.Rows[0].y,
  width: _rects.Stats.Inner.Rows[0].height,
  height: _rects.Stats.Inner.Rows[0].height
};
_rects.Stats.Inner.Rows[0].Label = {
  x: _rects.Stats.Inner.Rows[0].Icon.x + _rects.Stats.Inner.Rows[0].Icon.width,
  y: _rects.Stats.Inner.Rows[0].Icon.y,
  width: _rects.Stats.Inner.Rows[0].width - _rects.Stats.Inner.Rows[0].Icon.width,
  height: _rects.Stats.Inner.Rows[0].height
};

// Player HP
_rects.Stats.Inner.Rows[1].Icon = {
  x: _rects.Stats.Inner.Rows[1].x,
  y: _rects.Stats.Inner.Rows[1].y,
  width: _rects.Stats.Inner.Rows[1].height,
  height: _rects.Stats.Inner.Rows[1].height
};
_rects.Stats.Inner.Rows[1].Label = {
  x: _rects.Stats.Inner.Rows[1].Icon.x + _rects.Stats.Inner.Rows[1].Icon.width,
  y: _rects.Stats.Inner.Rows[1].y,
  width: (_rects.Stats.Inner.Rows[1].width * 0.4) - _rects.Stats.Inner.Rows[1].Icon.width,
  height: _rects.Stats.Inner.Rows[1].height
};
_rects.Stats.Inner.Rows[1].ProgressBar = {
  x: _rects.Stats.Inner.Rows[1].x + _rects.Stats.Inner.Rows[1].Icon.width + ((_rects.Stats.Inner.Rows[1].width * 0.4) - _rects.Stats.Inner.Rows[1].Icon.width),
  y: _rects.Stats.Inner.Rows[1].y,
  width: _rects.Stats.Inner.Rows[1].width * 0.6,
  height: _rects.Stats.Inner.Rows[1].height
};

// Player Stamina
_rects.Stats.Inner.Rows[2].Icon = {
  x: _rects.Stats.Inner.Rows[2].x,
  y: _rects.Stats.Inner.Rows[2].y,
  width: _rects.Stats.Inner.Rows[2].height,
  height: _rects.Stats.Inner.Rows[2].height
};
_rects.Stats.Inner.Rows[2].Label = {
  x: _rects.Stats.Inner.Rows[2].x + _rects.Stats.Inner.Rows[2].Icon.width,
  y: _rects.Stats.Inner.Rows[2].y,
  width: (_rects.Stats.Inner.Rows[2].width * 0.4) - _rects.Stats.Inner.Rows[2].Icon.width,
  height: _rects.Stats.Inner.Rows[2].height
};
_rects.Stats.Inner.Rows[2].ProgressBar = {
  x: _rects.Stats.Inner.Rows[2].x + _rects.Stats.Inner.Rows[2].Icon.width + ((_rects.Stats.Inner.Rows[2].width * 0.4) - _rects.Stats.Inner.Rows[2].Icon.width),
  y: _rects.Stats.Inner.Rows[2].y,
  width: _rects.Stats.Inner.Rows[2].width * 0.6,
  height: _rects.Stats.Inner.Rows[2].height
};

// Player XP
_rects.Stats.Inner.Rows[3].Icon = {
  x: _rects.Stats.Inner.Rows[3].x,
  y: _rects.Stats.Inner.Rows[3].y,
  width: _rects.Stats.Inner.Rows[3].height,
  height: _rects.Stats.Inner.Rows[3].height
};
_rects.Stats.Inner.Rows[3].Label = {
  x: _rects.Stats.Inner.Rows[3].x + _rects.Stats.Inner.Rows[3].Icon.width,
  y: _rects.Stats.Inner.Rows[3].y,
  width: (_rects.Stats.Inner.Rows[3].width * 0.4) - _rects.Stats.Inner.Rows[3].Icon.width,
  height: _rects.Stats.Inner.Rows[3].height
};
_rects.Stats.Inner.Rows[3].ProgressBar = {
  x: _rects.Stats.Inner.Rows[3].x + _rects.Stats.Inner.Rows[3].Icon.width + ((_rects.Stats.Inner.Rows[3].width * 0.4) - _rects.Stats.Inner.Rows[3].Icon.width),
  y: _rects.Stats.Inner.Rows[3].y,
  width: _rects.Stats.Inner.Rows[3].width * 0.6,
  height: _rects.Stats.Inner.Rows[3].height
};

// Profile class
export class Profile
{
  constructor(context, member, player, background)
  {
    this.context = context;
    this.rects = Object.freeze(_rects);
    this.member = member;
    this.player = player || new Player();
    //this.background = background || process.cwd() + "/images/bg.jpg";
    //this.background = background || 'https://cdn.akamai.steamstatic.com/steam/apps/799960/ss_741b909d39573968d3ef72ba2c11836bd8e24478.1920x1080.jpg?t=1618937889'
    //this.background = background || 'https://i.pinimg.com/736x/51/f7/2b/51f72b3d501c8497646cc8577d640218.jpg'
    this.background = background || process.cwd() + "/images/profile-bg.jpg";

    this.icons = [];
    this.loadIcons(context);
    this.fonts = [];
    this.loadFonts();
  }
    
  async loadIcons(context) {
    this.icons.push(await Canvas.loadImage(process.cwd() + '/images/level.png'));
    this.icons.push(await Canvas.loadImage(process.cwd() + '/images/health.png'));
    this.icons.push(await Canvas.loadImage(process.cwd() + '/images/stamina.png'));
    this.icons.push(await Canvas.loadImage(process.cwd() + '/images/xp.png'));
  }

  loadFonts() {
    this.fonts.push(RenderUtils.loadFont(process.cwd() + '/fonts/AncientModernTales-a7Po.ttf'));
    this.fonts.push(RenderUtils.loadFont(process.cwd() + '/fonts/EightBitDragon-anqx.ttf'));
    this.fonts.push(RenderUtils.loadFont(process.cwd() + '/fonts/SuperLegendBoy-4w8Y.ttf'));
    this.fonts.push(RenderUtils.loadFont(process.cwd() + '/fonts/AGoblinAppears-o2aV.ttf'));
  }

  setBackground(uri) {
    this.background = uri;
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

    // Draw gradient bg
    let grd = context.createLinearGradient(
      this.rects.Header.x, this.rects.Header.y,
      this.rects.Header.x + this.rects.Header.width,
      this.rects.Header.y + this.rects.Header.height
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

    // Draw name outline
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
    context.stroke();
    context.restore();

    // Draw player name
    let angle = RenderUtils.radiusInRect(this.rects.Header.Avatar) * 0.7071;
    RenderUtils.drawText(context, this.player.name, this.fonts[0], this.rects.Header.Name, {
      minSize: 5,
      maxSize: 100,
      vAlign: 'center',
      hAlign: 'center',
      fitMethod: 'baseline',
      textFillStyle: "#ffffff"
    });
    
    // Draw player avatar
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

  async renderStats(context)
  {
    context.save();

    // Create gradients
    let grdStats = context.createLinearGradient(
      this.rects.Stats.x, this.rects.Stats.y,
      this.rects.Stats.x + this.rects.Stats.width,
      this.rects.Stats.y + this.rects.Stats.height
    );
    grdStats.addColorStop(0,        "rgba(0,0,0,0.6)");
    grdStats.addColorStop(0.33333,  "rgba(128,128,128,0.8)");
    grdStats.addColorStop(0.66667,  "rgba(255,255,255,0.33)");
    grdStats.addColorStop(1,        "rgba(255,255,255,0.05)");

    let grdStatsInnerLight = context.createLinearGradient(
      this.rects.Stats.Inner.x, this.rects.Stats.Inner.y,
      this.rects.Stats.Inner.x + this.rects.Stats.Inner.width,
      this.rects.Stats.Inner.y + this.rects.Stats.Inner.height
    );
    grdStatsInnerLight.addColorStop(0,        "rgba(0,0,0,0.6)");
    grdStatsInnerLight.addColorStop(0.33333,  "rgba(128,128,128,0.8)");
    grdStatsInnerLight.addColorStop(0.66667,  "rgba(255,255,255,0.33)");
    grdStatsInnerLight.addColorStop(1,        "rgba(255,255,255,0.05)");
    
    let grdStatsInnerDark = context.createLinearGradient(
      this.rects.Stats.Inner.x, this.rects.Stats.Inner.y,
      this.rects.Stats.Inner.x + this.rects.Stats.Inner.width,
      this.rects.Stats.Inner.y + this.rects.Stats.Inner.height
    );
    grdStatsInnerDark.addColorStop(0,        "rgba(0,0,0,0.6)");
    grdStatsInnerDark.addColorStop(0.33333,  "rgba(64,64,64,0.8)");
    grdStatsInnerDark.addColorStop(0.66667,  "rgba(128,128,128,0.33)");
    grdStatsInnerDark.addColorStop(1,        "rgba(128,128,128,0.05)");

    // Clip to a rounded rectangle
    RenderUtils.roundRect(context,
      this.rects.Stats.x, this.rects.Stats.y,
      this.rects.Stats.width, this.rects.Stats.height, 10
    );
    context.clip();

    // Draw gradient bg
    context.fillStyle = grdStats;
    context.fillRect(
      this.rects.Stats.x, this.rects.Stats.y,
      this.rects.Stats.width, this.rects.Stats.height
    );

    // Draw stats outline
    context.save();
    context.beginPath();
    context.globalAlpha = 0.9;
    context.strokeStyle = '#000000';
    context.moveTo(this.rects.Stats.Inner.x, this.rects.Stats.Inner.y);
    context.lineTo(
      this.rects.Stats.Inner.x + this.rects.Stats.Inner.width,
      this.rects.Stats.Inner.y
    );
    context.moveTo(this.rects.Stats.Inner.x, this.rects.Stats.Inner.y + this.rects.Stats.Inner.height);
    context.lineTo(
      this.rects.Stats.Inner.x + this.rects.Stats.Inner.width,
      this.rects.Stats.Inner.y + this.rects.Stats.Inner.height
    );
    context.stroke();
    context.restore();

    context.save();
    let bDark = false;
    for(let row = 0; row < this.rects.Stats.Inner.Rows.length; row++) {
      context.fillStyle = bDark ? grdStatsInnerDark : grdStatsInnerLight;
      bDark = !bDark;
      context.fillRect(
        this.rects.Stats.Inner.Rows[row].x,
        this.rects.Stats.Inner.Rows[row].y,
        this.rects.Stats.Inner.Rows[row].width,
        this.rects.Stats.Inner.Rows[row].height
      );
    }
    context.restore();

    let leftAlign = {
      hAlign: 'left',
      textPadding: -5,
      // drawRect: true
    }
    let rightAlign = {
      hAlign: 'right',
      textPadding: -5,
      // drawRect: true
    }
    // Level
    context.drawImage(this.icons[0],
      this.rects.Stats.Inner.Rows[0].Icon.x, this.rects.Stats.Inner.Rows[0].Icon.y,
      this.rects.Stats.Inner.Rows[0].Icon.width, this.rects.Stats.Inner.Rows[0].Icon.height
    );
    RenderUtils.drawText(context, "Level " + this.player.attributes.level.toString(), this.fonts[1], this.rects.Stats.Inner.Rows[0].Label);
    // HP
    context.drawImage(this.icons[1],
      this.rects.Stats.Inner.Rows[1].Icon.x, this.rects.Stats.Inner.Rows[1].Icon.y,
      this.rects.Stats.Inner.Rows[1].Icon.width, this.rects.Stats.Inner.Rows[1].Icon.height
    );
    RenderUtils.drawText(context, "HP", this.fonts[1], this.rects.Stats.Inner.Rows[1].Label, leftAlign);
    RenderUtils.drawProgressBar(
      context, this.rects.Stats.Inner.Rows[1].ProgressBar,
      0, this.player.attributes.max_hp, this.player.attributes.stats.hp,
      { font: this.fonts[1], fillStyle: 'rgba(255, 0, 0, 0.6)' }
    );
    // Stamina
    context.drawImage(this.icons[2],
      this.rects.Stats.Inner.Rows[2].Icon.x, this.rects.Stats.Inner.Rows[2].Icon.y,
      this.rects.Stats.Inner.Rows[2].Icon.width, this.rects.Stats.Inner.Rows[2].Icon.height
    );
    RenderUtils.drawText(context, "STA", this.fonts[1], this.rects.Stats.Inner.Rows[2].Label, leftAlign);
    RenderUtils.drawProgressBar(
      context, this.rects.Stats.Inner.Rows[2].ProgressBar,
      0, this.player.attributes.max_stamina, this.player.attributes.stats.stamina,
      { font: this.fonts[1], fillStyle: 'rgba(255, 255, 0, 0.6)' }
    );
    // XP
    context.drawImage(this.icons[3],
      this.rects.Stats.Inner.Rows[3].Icon.x, this.rects.Stats.Inner.Rows[3].Icon.y,
      this.rects.Stats.Inner.Rows[3].Icon.width, this.rects.Stats.Inner.Rows[3].Icon.height
    );
    RenderUtils.drawText(context, "XP", this.fonts[1], this.rects.Stats.Inner.Rows[3].Label, leftAlign);
    RenderUtils.drawProgressBar(
      context, this.rects.Stats.Inner.Rows[3].ProgressBar,
      0, this.player.attributes.max_xp, this.player.attributes.stats.xp,
      { font: this.fonts[1], fillStyle: 'rgba(0, 0, 255, 0.6)' }
    );

    context.restore();
  }

  async renderAttributes(context)
  {
    context.save();
    
    // Clip to a rounded rectangle
    RenderUtils.roundRect(context,
      this.rects.Attributes.x, this.rects.Attributes.y,
      this.rects.Attributes.width, this.rects.Attributes.height, 10
    );
    context.clip();

    // Draw gradient bg
    let grd = context.createLinearGradient(
      this.rects.Attributes.x, this.rects.Attributes.y,
      this.rects.Attributes.x + this.rects.Attributes.width,
      this.rects.Attributes.y + this.rects.Attributes.height
    );
    grd.addColorStop(0, "rgba(0,0,0,0.6)");
    grd.addColorStop(0.33333, "rgba(128,128,128,0.8)");
    grd.addColorStop(0.66667, "rgba(255,255,255,0.33)");
    grd.addColorStop(1, "rgba(255,255,255,0.05)");
    context.fillStyle = grd;
    context.fillRect(
      this.rects.Attributes.x, this.rects.Attributes.y,
      this.rects.Attributes.width, this.rects.Attributes.height
    );

    // Draw Attributes outline
    context.save();
    context.beginPath();
    context.globalAlpha = 0.9;
    context.strokeStyle = '#000000';
    context.moveTo(this.rects.Attributes.Inner.x, this.rects.Attributes.Inner.y);
    context.lineTo(
      this.rects.Attributes.Inner.x + this.rects.Attributes.Inner.width,
      this.rects.Attributes.Inner.y
    );
    context.moveTo(this.rects.Attributes.Inner.x, this.rects.Attributes.Inner.y + this.rects.Attributes.Inner.height);
    context.lineTo(
      this.rects.Attributes.Inner.x + this.rects.Attributes.Inner.width,
      this.rects.Attributes.Inner.y + this.rects.Attributes.Inner.height
    );
    context.stroke();
    context.restore();

    context.restore();
  }

  async render()
  {
    this.context.save();

    // Draw the background
    this.context.strokeRect(0, 0, this.rects.Canvas.width, this.rects.Canvas.height);
    const background = await Canvas.loadImage(this.background);
    this.context.drawImage(background, 0, 0, this.rects.Canvas.width, this.rects.Canvas.height);

    // Draw grid
    //RenderUtils.drawGrid(this.context);

    // Draw the header
    await this.renderHeader(this.context);

    // Draw player stats
    await this.renderStats(this.context);

    // Draw player attributes
    await this.renderAttributes(this.context);

    this.context.restore();
  }
};