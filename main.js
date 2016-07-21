(function() {
  MAP_TO_GRASS = 5;
  MAP_WIDTH = 200;
  MAP_HEIGHT = 150;

  var mouseDown = false;

  var image = new Image();
  image.src = "hole.png"; // can also be a remote URL e.g. http://

  function getRndColor() {
    var r = 40*Math.random()|0,
        g = 150 + 100*Math.random()|0,
        b = 20*Math.random()|0;
      return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function grassToMap(grassCoords) {
    console.log(grassCoords);
    return {
      x: grassCoords.x / MAP_TO_GRASS,
      y: grassCoords.y / MAP_TO_GRASS
    }
  }

  function mapToGrass(mapCoords) {
    return {
      x: mapCoords.x * MAP_TO_GRASS,
      y: mapCoords.y * MAP_TO_GRASS
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
  }

  function my_circle(ctx, x, y, size, color1, color2){
    var color1_rgb = hex2rgb(color1);
    var color2_rgb = hex2rgb(color2);
    var radgrad = ctx.createRadialGradient(
        x, y, size*0,
        x, y, size);
    radgrad.addColorStop(0, "rgba("+color1_rgb.r+", "+color1_rgb.g+", "+color1_rgb.b+", 1)");
    radgrad.addColorStop(1, "rgba("+color2_rgb.r+", "+color2_rgb.g+", "+color2_rgb.b+", 0)");
    ctx.fillStyle = radgrad;
    ctx.fillRect(x-size,y-size,size*2,size*2);
    }

function hex2rgb(hex) {
    if (hex[0]=="#") hex=hex.substr(1);
    if (hex.length==3) {
        var temp=hex; hex='';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
        for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
    }
    var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
    return {
        r: parseInt(triplets[0],16),
        g: parseInt(triplets[1],16),
        b: parseInt(triplets[2],16),
        a: 255,
    }
};

  function drawGrass(mapCtx) {
    var grass = document.getElementById('grass');
    var grassCtx = grass.getContext('2d');
    grassCtx.clearRect(0, 0, grass.width, grass.height);

    var pixelData = mapCtx.getImageData(0, 0, 200, 150);
    for (var x = 0; x < pixelData.width; x++) {
      for (var y = 0; y < pixelData.height; y++) {
        var h = pixelData.data[y * (pixelData.width * 4) + x * 4];
        grassCtx.beginPath();
        grassCtx.lineWidth = 0.4;
        var r = Math.random() * 40;
        var g = Math.random() * 255;
        var b = Math.random() * 20;

        grassCtx.strokeStyle = getRndColor();
        grassCtx.moveTo(x*MAP_TO_GRASS + Math.random() * 5 - 2.5, y*MAP_TO_GRASS);
        grassCtx.lineTo(x*MAP_TO_GRASS + Math.random() * 5 - 2.5, y*MAP_TO_GRASS - h + Math.random() * 20);

        grassCtx.stroke();
      }
    }
  }

  function createMap() {
    var map = document.getElementById('map');
    var ctx = map.getContext('2d');
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    my_circle(ctx, 100, 100, 300, "#000000", "#ffffff");
  }

  $(grass).on('mousedown', function(e) {
    mouseDown = true;
  });

  $(grass).on('mousemove', function(e) {
    if (mouseDown) {
      var pos = grassToMap(getMousePos(grass, e));
      var map = document.getElementById('map');
      var ctx = map.getContext('2d');

      console.log(pos.x, pos.y);

      ctx.drawImage(image, pos.x - image.width / 2, pos.y - image.height / 2);
      drawGrass(document.getElementById('map').getContext('2d'));
    }
  });

  $(grass).on('mouseup', function(e) {
    mouseDown = false;
  });

  createMap();
  drawGrass(document.getElementById('map').getContext('2d'));
  requestAnimationFrame(animate);
})();