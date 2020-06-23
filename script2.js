if (!localStorage.stepTime) {
    localStorage.stepTime = 45
}
GM_addStyle(`
.menu{
pointer-events: none; position: fixed; left:10px; font-family: 'Comic Sans MS', cursive, sans-serif; color: rgba(255,255,255,0.5); font-style: normal; font-variant: normal;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;outline: 0;
}
* {
font-family: 'Ubuntu';
}
`)
$(document.getElementById('canvas')).ready(function() {
    var hasEnter = false;
    var wavy = localStorage.wavy || "false";
    var wavySpeed = localStorage.wavySpeed || 420;
    var binLocked = false;
    var inners = [`<p>•[H]- or [J]+ for petal manipulation speed change (${localStorage.stepTime}ms)</p>`,`<p>•Use ${binLocked? '[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>' : '[F] to trash the last petal from your stored slots and [CTRL]+[F] to lock it <span style="color: green">(NOT LOCKED)</span>'}</p>`]
    var innerids = ["speedChange","binOverlay"]
    var Playing = false;
    for (var i = 0; i < inners.length; i++) {
        var overlay = document.createElement("div");
        overlay.className = "menu";
        overlay.id = innerids[i]
        overlay.innerHTML = inners[i]
        overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
        document.body.appendChild(overlay);
    }
    if (!document.getElementById('pressEnter')){
        hasEnter = true;
        overlay = document.createElement("div");
        overlay.style = "pointer-events: none; position: fixed; top:-100px; left:10px; font-family: 'Comic Sans MS', cursive, sans-serif; color: rgba(255,0,0,0.75); font-style: normal; font-variant: normal;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;outline: 0;";
        overlay.innerHTML = `<p>PRESS [ENTER] FIRST</p>`
        overlay.id = "pressEnter";
        document.body.appendChild(overlay);
        overlay = document.createElement("div");
        overlay.className = "menu";
        overlay.innerHTML = `<p>•Use [Backslash] to toggle menu display</p>`
        overlay.id = "menuDisp";
        overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
        document.body.appendChild(overlay);
        setTimeout(function(){
            document.getElementById('pressEnter').style.top = (50+document.getElementsByClassName("menu").length*20)+"px";
        },100)
    }
    var eventObj;
    var oktoggle = true;
    var okbin = true;
    var keyss = {};
    function lockedTrash() {
        setTimeout(function(){
            if (binLocked) {
                eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 69; window.dispatchEvent(eventObj);
                eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 69; window.dispatchEvent(eventObj);
            }
            setTimeout(function(){
                if (binLocked) {
                    eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 84; window.dispatchEvent(eventObj);
                    eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 84; window.dispatchEvent(eventObj);
                }
                lockedTrash()
            },localStorage.stepTime)
        },localStorage.stepTime)
    }
    lockedTrash();
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        keyss[e.code] = e.type == 'keydown';
        if (e.code == "KeyF" && keyss["KeyF"] && okbin) {
            if (!e.ctrlKey) {
                if (binLocked) {
                    binLocked = false;
                    document.getElementById('binOverlay').innerHTML = `<p>•Use ${binLocked? '[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>' : '[F] to trash the last petal from your stored slots and [CTRL]+[F] to lock it <span style="color: green">(NOT LOCKED)</span>'}</p>`;
                }
                okbin = false;
                eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 27; window.dispatchEvent(eventObj);
                eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 27; window.dispatchEvent(eventObj);
                setTimeout(function(){
                    eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 81; window.dispatchEvent(eventObj);
                    eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 81; window.dispatchEvent(eventObj);
                    setTimeout(function(){
                        eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 81; window.dispatchEvent(eventObj);
                        eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 81; window.dispatchEvent(eventObj);
                        setTimeout(function(){
                            eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 84; window.dispatchEvent(eventObj);
                            eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 84; window.dispatchEvent(eventObj);
                            setTimeout(function(){
                                eventObj = document.createEvent("Events"); eventObj.initEvent('keydown', true, true); eventObj.keyCode = 27; window.dispatchEvent(eventObj);
                                eventObj = document.createEvent("Events"); eventObj.initEvent('keyup', true, true); eventObj.keyCode = 27; window.dispatchEvent(eventObj);
                                okbin = true;
                            },localStorage.stepTime)
                        },localStorage.stepTime)
                    },localStorage.stepTime*1.5)
                },localStorage.stepTime)
            } else if (!binLocked) {
                binLocked = true;
                document.getElementById('binOverlay').innerHTML = `<p>•Use ${binLocked? '[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>' : '[F] to trash the last petal from your stored slots and [CTRL]+[F] to lock it <span style="color: green">(NOT LOCKED)</span>'}</p>`;
            } else {
                binLocked = false;
                document.getElementById('binOverlay').innerHTML = `<p>•Use ${binLocked? '[F] to unlock auto-trash <span style="color: red">(LOCKED)</span>' : '[F] to trash the last petal from your stored slots and [CTRL]+[F] to lock it <span style="color: green">(NOT LOCKED)</span>'}</p>`;
            }
        }
        if (hasEnter) {
            if (e.code == "Backslash" && keyss["Backslash"]) {
                for (var i = 0; i < document.getElementsByClassName("menu").length; i++) {
                    document.getElementsByClassName("menu")[i].style.display = document.getElementsByClassName("menu")[i].style.display != "none"? "none" : "block";
                }
            }
            if (e.code = "Enter" && keyss["Enter"]) {
                document.getElementById('pressEnter').style.display = "none";
            }
        }
        if (!!document.getElementById('pressEnter') && document.getElementById('pressEnter').style.display == "none") {
            if (e.code == "KeyH" && keyss["KeyH"]) {
                localStorage.stepTime = Math.max(0,localStorage.stepTime-1)
                document.getElementById('speedChange').innerHTML = `<p>•[H]- or [J]+ for petal manipulation speed change (${localStorage.stepTime}ms)</p>`;
            } else if (e.code == "KeyJ" && keyss["KeyJ"]) {
                localStorage.stepTime++
                document.getElementById('speedChange').innerHTML = `<p>•[H]- or [J]+ for petal manipulation speed change (${localStorage.stepTime}ms)</p>`;
            }
        }
    }
})
