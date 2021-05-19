<script>
  import { onMount } from 'svelte'
  import * as rrweb from 'rrweb'
  import rrwebPlayer from 'rrweb-player'
  export let startRecord = false
  export let startVideo = false
  let stopFn = null
  const events = []

  function handleRecord() {
    if (startRecord = !startRecord) {
      // 点击开始录制
      console.log('点击开始录制')
      stopFn = rrweb.record({
        emit(event) {
          events.push(event)
        },
        recordCanvas: true
      })
    } else {
      // 点击结束录制
      console.log('点击结束录制')
      stopFn()
    }
  }
  function handleVideo() {
    if (startVideo = !startVideo) {
      // 点击开始播放
      console.log('点击开始播放')
      if (events.length) {
        // 开始播放
        new rrwebPlayer({
          target: document.getElementById('video'),
          props: {
            events,
            width: 600,
            height: 446,
            UNSAFE_replayCanvas: true
          },
          UNSAFE_replayCanvas: true
        })
      }
    } else {
      // 点击结束播放
      console.log('点击结束播放')
    }
  }
  function clearRecord() {
    events.length = 0
  }

  let paint = false
  let clickX = new Array()
  let clickY = new Array()
  let clickDrag = new Array()
  let canvas = null
  let context = null
  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  }
  function redraw(){
    canvas.width = canvas.width; // Clears the canvas
  
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
  
    for(var i=0; i < clickX.length; i++)
    {
      context.beginPath();
      if(clickDrag[i] && i){//当是拖动而且i!=0时，从上一个点开始画线。
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();
    }
  }
  onMount(() => {
    canvas = document.getElementById('canvas')
    context = document.getElementById('canvas').getContext("2d")

    canvas.addEventListener('mousedown', function(e){
      let mouseX = e.pageX - this.offsetLeft;
      let mouseY = e.pageY - this.offsetTop;
      paint = true;
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
      redraw();
    })
    canvas.addEventListener('mousemove', function(e){
      if(paint){//是不是按下了鼠标
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
      }
    })
    canvas.addEventListener('mouseup', function(e){
      paint = false;
    })
    canvas.addEventListener('mouseleave', function(e){
      paint = false;
    })
  })


</script>

<main>
	<div class="btns">
    <span on:click={handleRecord}>{startRecord?'结束':'开始'}录制</span>
    <span on:click={handleVideo}>{startVideo?'结束':'开始'}播放</span>
    <span on:click={clearRecord}>清除记录</span>
  </div>
  <div class="pages">
    <div class="left">
      <p>录制页面</p>
      <div id="record">
        <canvas id="canvas" width="600" height="446"></canvas>
      </div>
    </div>
    <div class="right">
      <p>播放页面</p>
      <div id="video"></div>
    </div>
  </div>
	
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 100%;
		margin: 0 auto;
	}
  .btns {
    padding: 10px 15px;
    text-align: center;
    cursor: pointer;
  }
  .btns span:hover {
    color: blue;
  }
  .btns span+span {
    margin-left: 15px;
  }
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  .pages>div {
    width: 600px;
    height: 500px;
    border: 1px solid #DDD;
  }
  .pages>div div {
    width: 100%;
    height: 446px;
    background-color: #DDD;
  }
  
</style>