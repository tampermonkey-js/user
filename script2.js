var socket,gameScene="menu",flowerLvl=1;const WebSocketProxy=new Proxy(unsafeWindow.WebSocket,{set:(e,n,t)=>!0,get:(e,n)=>"__isProxy"===n||e[n],construct(e,n){if("noProxy"===n[0])return e.__isProxy?Reflect.construct(e,n):Reflect.construct(e,n.slice(1));const t=Reflect.construct(...arguments),o=new Proxy(t.send,{apply(e,n,t){if(t[0]instanceof Int8Array&&1===t[0][0])if(11===t[0].length){const e=[...t[0].slice(3,11)],n=new Array(8).fill(0);e.every((e,t)=>e===n[t])||"menu"!=gameScene||(gameScene="playing",updateElems())}else 2==t[0].length&&t[0].every((e,n)=>e===[1,0][n])&&(gameScene="menu",updateElems());return Reflect.apply(...arguments)}});return t.send=o,t.addEventListener("close",function(){gameScene="menu",updateElems()}),socket=t,t}});unsafeWindow.WebSocket=WebSocketProxy;const CVS=unsafeWindow.OffscreenCanvasRenderingContext2D?"OffscreenCanvasRenderingContext2D":unsafeWindow.CanvasRenderingContext2D?"CanvasRenderingContext2D":"";if(CVS){const e=new Proxy(unsafeWindow[CVS].prototype.fillText,{set:(e,n,t)=>!0,get:(e,n)=>"__isProxy"===n||e[n],apply(e,n,t){return"noProxy"===t[0]?e.__isProxy?Reflect.apply(e,n,t):Reflect.apply(e,n,t.slice(1)):(t[0].includes("-")||(t[0].includes("Lvl ")&&t[0].includes(" Flower")&&(flowerLvl=Number(t[0].replace("Lvl ","").replace(" Flower",""))),t[0].includes("Lvl ")&&t[0].includes(" Flower")&&"menu"==gameScene?(gameScene="playing",updateElems()):t[0].includes("Points: ")&&"Points: 0"!=t[0]&&"playing"==gameScene&&(gameScene="death",updateElems())),Reflect.apply(...arguments))}});unsafeWindow[CVS].prototype.fillText=e}else alert(`Your browser doesn't support this script, try switching to Chrome or Firefox or uninstall the script nammed "${GM_info.script.name}"`);var florrKeydown,florrKeyup;const proxy=new Proxy(EventTarget.prototype.addEventListener,{set:(e,n,t)=>!0,get:(e,n)=>"__isProxy"===n||e[n],apply(e,n,t){return"noProxy"===t[0]?e.__isProxy?Reflect.apply(e,n,t):Reflect.apply(e,n,t.slice(1)):(0==arguments[2][2]&&("keydown"==arguments[2][0]&&(florrKeydown=arguments[2][1]),"keyup"==arguments[2][0]&&(florrKeyup=arguments[2][1])),Reflect.apply(...arguments))}});EventTarget.prototype.addEventListener=proxy;var binLockedInt,binLocked=!1,okbin=!0;function keyEvt(e,n){if(florrKeydown&&florrKeyup){var t=document.createEvent("Events");t.initEvent(e,!0,!0),t.keyCode=n,"keydown"==e?florrKeydown(t):florrKeyup(t)}}function autoTrash(){if(socket)for(var e=flowerLvl<15?5:flowerLvl<30?6:flowerLvl<45?7:8,n=e;n<e+8;n++)for(var t=1;t<=32;t++)socket.send(new Int8Array([1,6,n,t,0]))}GM_addStyle("\n.menu{\npointer-events: none; position: fixed; left:10px; color: rgba(255,255,255,0.5); font-style: normal; font-variant: normal;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;outline: 0;\n}\n* {\nfont-family: 'Ubuntu';\n}\n");var hasMenuDisp=!1;function updateElems(){document.getElementById("trashBanner").innerHTML=`<p>•Press ${"menu"==gameScene?"[CTRL]+[F] to "+(binLocked?"unlock auto-trash (LOCKED)":"lock auto-trash (NOT LOCKED)"):binLocked?'[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>':'[F] to trash the last petal from your inventory and [CTRL]+[F] to lock auto-trash <span style="color: green">(NOT LOCKED)</span>'}</p>`,document.getElementById("menuDisp")&&hasMenuDisp&&(document.getElementById("menuDisp").innerHTML=`<p>•Use ${"menu"==gameScene?"[CTRL]+":""}[Equal] key to toggle menu display</p>`)}document.addEventListener("DOMContentLoaded",function(){var e=document.createElement("div");e.className="menu",e.id="trashBanner",e.innerHTML=`<p>•Press ${"menu"==gameScene?"[CTRL]+[F] to "+(binLocked?"unlock auto-trash (LOCKED)":"lock auto-trash (NOT LOCKED)"):binLocked?'[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>':'[F] to trash the last petal from your inventory and [CTRL]+[F] to lock auto-trash <span style="color: green">(NOT LOCKED)</span>'}</p>`,e.style.top=30+20*document.getElementsByClassName("menu").length+"px",document.body.appendChild(e),document.getElementById("menuDisp")||(hasMenuDisp=!0,(e=document.createElement("div")).innerHTML=`<p>•Use ${"menu"==gameScene?"[CTRL]+":""}[Equal] key to toggle menu display</p>`,e.id="menuDisp",e.style.display="none",document.body.appendChild(e),setTimeout(function(){e.style.display="block",e.style.top=30+20*document.getElementsByClassName("menu").length+"px",e.className="menu"},100));var n=document.getElementById("menuDisp");new MutationObserver(function(){for(var e=0;e<document.getElementsByClassName("menu").length;e++)document.getElementsByClassName("menu")[e].style.display=n.style.display}).observe(n,{attributes:!0,childList:!0}),document.addEventListener("keydown",function(e){(e.ctrlKey||"menu"!=gameScene||"Equal"==e.code&&"none"==n.style.display)&&("KeyF"==e.code&&okbin?e.ctrlKey?binLocked?(binLocked=!1,clearInterval(binLockedInt),document.getElementById("trashBanner").innerHTML=`<p>•Press ${"menu"==gameScene?"[CTRL]+[F] to "+(binLocked?"unlock auto-trash (LOCKED)":"lock auto-trash (NOT LOCKED)"):binLocked?'[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>':'[F] to trash the last petal from your inventory and [CTRL]+[F] to lock auto-trash <span style="color: green">(NOT LOCKED)</span>'}</p>`):(binLocked=!0,binLockedInt=setInterval(function(){autoTrash()},1e3),document.getElementById("trashBanner").innerHTML=`<p>•Press ${"menu"==gameScene?"[CTRL]+[F] to "+(binLocked?"unlock auto-trash (LOCKED)":"lock auto-trash (NOT LOCKED)"):binLocked?'[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>':'[F] to trash the last petal from your inventory and [CTRL]+[F] to lock auto-trash <span style="color: green">(NOT LOCKED)</span>'}</p>`):(binLocked&&(binLocked=!1,clearInterval(binLockedInt),document.getElementById("trashBanner").innerHTML=`<p>•Press ${"menu"==gameScene?"[CTRL]+[F] to "+(binLocked?"unlock auto-trash (LOCKED)":"lock auto-trash (NOT LOCKED)"):binLocked?'[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>':'[F] to trash the last petal from your inventory and [CTRL]+[F] to lock auto-trash <span style="color: green">(NOT LOCKED)</span>'}</p>`),okbin=!1,keyEvt("keydown",27),keyEvt("keyup",27),setTimeout(function(){keyEvt("keydown",81),keyEvt("keyup",81),setTimeout(function(){keyEvt("keydown",81),keyEvt("keyup",81),setTimeout(function(){keyEvt("keydown",84),keyEvt("keyup",84),setTimeout(function(){keyEvt("keydown",27),keyEvt("keyup",27),okbin=!0},2)},2)},2)},2)):"Equal"==e.code&&hasMenuDisp&&(e.preventDefault(),n.style.display="none"!=n.style.display?"none":"block"))})});
