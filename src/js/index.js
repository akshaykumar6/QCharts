
var color = new Array("#29ABE2","#A8CD58","#bf53f2","teal","#f162f3","#635af4","#AC4040","#86dc68","#33338b", "#ffc726","olive","#b5b5b5","#f57272");
var label,values,dataCount;
var stage,pieChartLayer,columnChartLayer,lineChartLayer,legendLayer,chartTitleLayer,labelLayer,mainLayer;
var click=1;
var angle = new Array();
var chartType;
var tempWedge,tempMax;
var tooltip,tip,diff,scale,pt,ptscale;

function onBodyLoad(){

  stage = new Kinetic.Stage({
    container: 'viewPoint',
    width: 1098,
    height: 500
  });
  pieChartLayer = new Kinetic.Layer();
  columnChartLayer = new Kinetic.Layer();
  lineChartLayer = new Kinetic.Layer();
  legendLayer = new Kinetic.Layer();
  chartTitleLayer = new Kinetic.Layer();
  labelLayer = new Kinetic.Layer();
  mainLayer = new Kinetic.Layer();

  chartType=0;
  drawChartTitle('Chart Title');
  drawPieChart(0);
}

function setChartType(i)
{
  tooltip = undefined;
  chartType = i;
  switch(chartType)
  {
    case 0: drawPieChart(0);
    break;
    case 1: drawColumnChart(0);
    break;
    case 2: drawLineChart();
    break;
    case 3: drawPieChart(0);
    break;        
  }
}

function addRows() {
  var id=1;
  var txtBoxLabel = document.createElement("input");
  var txtBoxValue = document.createElement("input");
  var area = document.getElementById("tableDataRows");
  getData();

  j=dataCount+1;
  if (j>18)
  {
    alert("Maximum 18 Data Rows allowed.");
  } 
  else{
    txtBoxLabel.setAttribute("type", "text");
    txtBoxLabel.setAttribute("class", "inputData");
    txtBoxLabel.setAttribute("name", "label");
    txtBoxLabel.setAttribute("value", "label"+j);
    txtBoxLabel.required;
    txtBoxValue.setAttribute("id", j);
    txtBoxValue.setAttribute("type", "number");
    txtBoxValue.setAttribute("class", "inputData");
    txtBoxValue.setAttribute("name", "value"); 
    txtBoxValue.setAttribute("value", 50);   

    txtBoxValue.onchange = editChart;
    txtBoxLabel.onblur = editLegend;
    
    area.appendChild(txtBoxLabel);
    area.appendChild(txtBoxValue);
    tooltip = undefined;
    switch(chartType)
    {
      case 0: drawPieChart(1);
      break;
      case 1: drawColumnChart(1);
      break;
      case 2: drawLineChart();
      break;
      case 3: drawPieChart(1);
      break;        
    }
  }
}

function reset(){
  var parent = document.getElementById('tableDataRows');
  parent.removeChild(parent.lastChild);
  parent.removeChild(parent.lastChild);
  switch(chartType)
  {
    case 0: drawPieChart(1);
    break;
    case 1: drawColumnChart(1);
    break;
    case 2: drawLineChart();
    break;
    case 3: drawPieChart(1);
    break;        
  }
}

function getData(){
  label = document.getElementsByName('label');
  values = document.getElementsByName('value');
  dataCount = label.length;

  if (chartType==0||chartType==3) {
    var sum=0;
    for (var i = 0; i < dataCount; i++) {
      sum=(sum*1)+(1*values[i].value);
    }
    
    for (var i = 0; i < dataCount; i++) {
      angle[i]=(values[i].value*360)/sum;
    }
  }
}

function editChart() {
  switch(chartType)
  {
    case 0: editPieChart();
    break;
    case 1: editColumnChart(event.target.id);
    break;
    case 2: editLineChart();
    break;
    case 3: editPieChart();
    break;        
  }
}

function editLegend() {
  legendLayer.removeChildren();
  labelLayer.removeChildren();
  for (var i = 0; i < dataCount; i++) {
    drawLegend(i);
  };
  if (chartType==1||chartType==2)
  {
    for (var i = 0; i < dataCount; i++) {
      drawLabel(i);
    };
  }  
}

function drawChartTitle (title) {
  chartTitleLayer.removeChildren();
  var title = new Kinetic.Text({
    x: 450,
    y: 15,
    text: title,
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'black'
  })
  chartTitleLayer.add(title);
  stage.add(chartTitleLayer);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////       PIE CHART
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


function drawPieChart(flag){
  /*if (flag==0) {
    columnChartLayer.remove();
    lineChartLayer.remove();
    labelLayer.remove();
  }*/
  stage.clear();
  stage.clear();
  pieChartLayer.removeChildren();
  drawMainLayer();
  getData();
  var rot=0;
  legendLayer.removeChildren();
  for (var i = 0; i < dataCount; i++) {
    
    wedge = new Kinetic.Wedge({
      x: 500,
      y: 248,
      radius: 170,
      angleDeg: 0+(1*flag*angle[i]),
      fill: color[i%color.length],
      stroke: "#ffffff",
      strokeWidth: 2,
      rotationDeg: 0+(1*flag*rot),
      draggable: false,
      id: i,
      name: label[i].value
    });
    rot+=angle[i];
    drawLegend(i);
    ////////////////// EVENTS
    wedge.on('mouseover', function(evt) {
      getData();
      this.setOpacity(0.7);
      getCoordinates(evt);
      if(tooltip == undefined){
        tooltip = new Kinetic.Rect({
          x:corX-80,
          y:corY-50,
          width:80,
          height:30,
          fill:'white',
          stroke:'black',
          strokeWidth:2,
          opacity: 0.6,
          cornerRadius:5
        });
        tip = new Kinetic.Text({
          x:corX-70,
          y:corY-40,
          text: label[this.getId()].value+" : "+Math.round((this.getAngleDeg()*100)/360)+"%",
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'black'
        });
        pieChartLayer.add(tooltip);
        pieChartLayer.add(tip);        
      }
      else{
        tooltip.setVisible(true);
        tip.setVisible(true);
        tip.setText(label[this.getId()].value+" : "+Math.round((this.getAngleDeg()*100)/360)+"%");
      }
      
      pieChartLayer.draw();
    });
    wedge.on('mousemove', function(evt){
      getCoordinates(evt);
      tooltip.setX(corX-80);
      tooltip.setY(corY-50);
      tip.setX(corX-70);
      tip.setY(corY-40);
      pieChartLayer.draw();
    });

    wedge.on('mouseout', function() {
      this.setOpacity(1);
      tooltip.setVisible(false);
      tip.setVisible(false);
      pieChartLayer.draw();
    });
    wedge.on('click', function() {
      if(chartType==0){
        var theta = (this.getAngle()/2)+(this.getRotation()%(Math.PI/2));

        if ((this.getRotationDeg()>=0&&this.getRotationDeg()<90)||(this.getRotationDeg()>=180&&this.getRotationDeg()<270)) 
        {
          var disX = 20*Math.cos(theta);
          var disY = 20*Math.sin(theta);
        } 
        else if  ((this.getRotationDeg()>=90&&this.getRotationDeg()<180)||(this.getRotationDeg()>=270&&this.getRotationDeg()<360)) 
        {
          var disX = 20*Math.sin(theta);
          var disY = 20*Math.cos(theta);
        }

        
        if (disY<0) {disY=-1*disY;}
        if (disX<0) {disX=-1*disX;}
        var rotDeg = this.getRotationDeg()+(this.getAngleDeg()/2);
        if (tempWedge!=this) {
          for (var j = 0; j < dataCount; j++) {
            var shape = stage.get('#'+j)[0];
            shape.transitionTo({x:500,y:248,duration:0.6,easing:'ease-in'});
          }
          click=1;
        } 
        rotDeg = Math.ceil(rotDeg);
        if(click==1){
          
          if (rotDeg>=0 && rotDeg<90) {
            click=0;
            this.transitionTo({x:500+disX,y:248+disY,duration:0.6,easing:'ease-out'});
            
          }
          else if (rotDeg>=90 && rotDeg<180) {
            click=0;
            this.transitionTo({x:500-disX,y:248+disY,duration:0.6,easing:'ease-out'});
            
          }
          else if (rotDeg>180 && rotDeg<270) {
            click=0;
            this.transitionTo({x:500-disX,y:248-disY,duration:0.6,easing:'ease-out'});
          }
          else if (rotDeg>=270 && rotDeg<360) {
            click=0;
            this.transitionTo({x:500+disX,y:248-disY,duration:0.6,easing:'ease-out'});
          }
          else if (rotDeg==180) {
            click=0;
            this.transitionTo({x:500-disX,y:248,duration:0.6,easing:'ease-out'});
          }
          else if (rotDeg==90) {
            click=0;
            this.transitionTo({x:500,y:248+disY,duration:0.6,easing:'ease-out'});
          }
          else if (rotDeg==270) {
            click=0;
            this.transitionTo({x:500,y:248-disY,duration:0.6,easing:'ease-out'});
          }
        }
        else{
          this.transitionTo({x:500,y:248,duration:0.6,easing:'ease-in'});
          click=1;
        }
        tempWedge = this;}
      });
pieChartLayer.add(wedge);
}

if (chartType==3) 
{
  var maincircle = new Kinetic.Circle({
    x: 500,
    y: 248,
    radius: 130,
    fill: 'white'
  });
  pieChartLayer.add(maincircle);
};


      // add the layer to the stage
      stage.add(pieChartLayer);
      rot=0;
      if(flag==0){
        for (var j = 0; j < dataCount; j++) {
          var shape = stage.get('#'+j)[0];
          shape.transitionTo({angleDeg: angle[j],rotationDeg:rot,duration:1.6,easing:'ease-out'});
          rot+=angle[j];
        }
      }
    }

    function editPieChart(){
      getData();
      var rot=0;
      for (var j = 0; j < angle.length; j++) {
        var shape = stage.get('#'+j)[0];
        shape.transitionTo({angleDeg: angle[j],rotationDeg: rot,duration:1,easing:'ease-out'});
        rot+=angle[j];
      }
    }
    function getCoordinates (evt) {
      if (evt.offsetX==undefined) 
      {
        corX=evt.layerX;
        corY=evt.layerY;
      }
      else
      {
        corX=evt.offsetX;
        corY=evt.offsetY;
      }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////       COLUMN CHART
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function drawColumnChart (flag) {
  /*if (flag==0) {
    pieChartLayer.remove();
    lineChartLayer.remove();
  }*/
  stage.clear();
  legendLayer.removeChildren();
  columnChartLayer.removeChildren();
  drawMainLayer();
  getData();
  
  var max=values[0].value;
  for (var i = 1; i < dataCount; i++) {
    if((values[i].value*1)>=(max*1))
    {
      max=values[i].value;
      
    }
  }
  setScale(max);
  tempMax=pt;
  i=1;
  while(pt>=0)
  {   
    
    line = new Kinetic.Line({
      points: [70,i*scale, 850, i*scale],
      stroke: 'black',
      strokeWidth: 0.2,
    });
    var point = new Kinetic.Text({
      x: 50,
      y: i*scale-5,
      text: pt,
      fontSize: 10,
      fontFamily: 'Calibri',
      fill: 'black'
    });
    pt-=diff;
    i++;
    columnChartLayer.add(line);
    columnChartLayer.add(point);
  }
  labelLayer.removeChildren();
  legendLayer.removeChildren();
  for (var i = 0; i < dataCount; i++) {
    var rect = new Kinetic.Rect({
      x: 100+(40*i),
      y: 480-(ptscale*values[i].value*flag),
      fill: color[i%color.length],
      width: 20,
      height:0+(flag*ptscale*values[i].value),
      cornerRadius: 2,
      id:'rect'+i
    });
    drawLegend(i);
    drawLabel(i);
    columnChartLayer.add(rect);
  };
  stage.add(columnChartLayer);
  if(flag==0){
    for (var j = 0; j <dataCount; j++) {
      var shape = stage.get('#rect'+j)[0];
      var h = (ptscale*values[j].value);
      var y = 480-(ptscale*values[j].value);
      shape.transitionTo({y:y,height:h,duration:1,easing:'ease-out'});
    }
  }
}

function editColumnChart (j) {
  getData();
  var max=0;
  for (var i = 0; i < dataCount; i++) {
    if((values[i].value*1)>=(max*1))
      {max=values[i].value;}
    
  }
  
  setScale(max);
  
  if (tempMax==pt) 
  {
    
    var shape = stage.get('#rect'+(j-1))[0];
    var h = (ptscale*values[j-1].value);
    var y = 480-(ptscale*values[j-1].value);
    shape.transitionTo({y:y,height:h,duration:1,easing:'ease-out'});
  }
  else
    drawColumnChart(0);
}

function setScale (max) {
  var mark = new Array(1,2,5);
  var i=0;
  diff=1;
  var pow;
  var q;
  while(1)
  {
    j=i/3;
    pow=1;
    for (var k = 0; k <=j; k++) {
      pow=pow*10;
    }
    t=mark[i%3]*pow;
    if (max<t) {
      break;
    }
    i++;
    q=t;
  }
  j=i/3;
  pow=1;
  for (var k = 1; k <=j; k++) {
    pow=pow*10;
  }
  diff=mark[i%3]*pow;

  pt=0;
  var r=1;
  while(pt<=max){pt+=diff;r++;}
  pt+=diff;
  scale=480/r;
  ptscale=480/pt;
  i=1;
  pt-=diff;
}
function drawLabel (i) {
  var xLabelName = new Kinetic.Text({
    x: 100+(40*i),
    y: 485,
    text: label[i].value,
    fontSize: 10,
    fontFamily: 'Calibri',
    fill: 'black'
  });
  if (chartType==1) 
  {
    labelLayer.add(xLabelName);
    stage.add(labelLayer);
  } 
  else
  {
    labelLayer.add(xLabelName);
    stage.add(labelLayer);
  };
  
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
///////       LINE CHART
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function drawLineChart() {
	stage.clear();
	stage.clear();
    //pieChartLayer.remove();
    //columnChartLayer.remove();
    labelLayer.removeChildren();
    lineChartLayer.removeChildren();
    drawMainLayer();
    getData();
    var mark = new Array(1,2,5);
    var max=values[0].value;
    for (var i = 1; i < dataCount; i++) {
      if((values[i].value*1)>=(max*1))
      {
        max=values[i].value;
        
      }
      
    }
  ////////////// LOGIC START
  setScale(max);
  ////////////// LOGIC ENDS
  i=1;
  tempMax = pt;
  while(pt>=0)
  {   
    
    line = new Kinetic.Line({
      points: [70,i*scale, 850, i*scale],
      stroke: 'black',
      strokeWidth: 0.2,
    });
    var point = new Kinetic.Text({
      x: 50,
      y: i*scale-5,
      text: pt,
      fontSize: 10,
      fontFamily: 'Calibri',
      fill: 'black'
    });
    pt-=diff;
    i++;
    lineChartLayer.add(line);
    lineChartLayer.add(point);
  }

  legendLayer.removeChildren();
  var line;
  var chartLine = new Kinetic.Line({
    points:[100,480-(ptscale*values[0].value)],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    id:'chartLine'
  });
  lineChartLayer.add(chartLine);
  stage.add(lineChartLayer);
  for (var i = 0; i < dataCount; i++) {
    var circle = new Kinetic.Circle({
      x: 100+(40*i),
      y: 480-(ptscale*values[i].value),
      radius:5,
      fill: color[i]
    });
    line = stage.get('#chartLine')[0];
    line.attrs.points.push({x:100+(40*i), y:480-(ptscale*values[i].value)});
    drawLegend(i);
    drawLabel(i);
    lineChartLayer.add(circle);
  }

  stage.add(lineChartLayer);
}

function editLineChart () {
  
  drawLineChart();
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function drawMainLayer(){
 var rect = new Kinetic.Rect({
  x: 0,
  y: 0,
  fill: 'white',
  width: stage.getWidth(),
  height: stage.getHeight()
});

 mainLayer.add(rect);

 stage.add(mainLayer);
//mainLayer.setZIndex(1);
}
function drawLegend (i) {
  var rect = new Kinetic.Rect({
    x: 920,
    y: 45+(25*i),
    fill: color[i%color.length],
    width: 60,
    height: 20,
    cornerRadius: 2
  });

  var labelName = new Kinetic.Text({
    x: 1000,
    y: 45+(25*i),
    text: label[i].value,
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: 'black'
  });
  legendLayer.add(rect);
  legendLayer.add(labelName);
  stage.add(legendLayer);
}

document.getElementById('saveJpeg').addEventListener('click', function() {
 
  stage.toDataURL({
    mimeType:'image/jpeg',
    callback: function(dataUrl) {
      window.open(dataUrl);
    }
  });
  mainLayer.remove();
}, false);

document.getElementById('savePng').addEventListener('click', function() {
  stage.toDataURL({
    mimeType:'image/png',
    callback: function(dataUrl) {
      window.open(dataUrl);
    }
  });
}, false);