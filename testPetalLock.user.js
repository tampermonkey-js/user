// ==UserScript==
// @name         Florr.io Lock & Disable Trashing of Specific Petals & Slots!
// @version      1.0
// @description  With this script, you can lock specific petals which means if you have chosen for example to lock fast petal, you won't be able to trash it or if you have selected a specific slot, you won't be able to directly trash any petal in this slot (useful for petals you don't want to trash by accident)!
// @author       woold#2808
// @match        *://florr.io/*
// @grant        unsafeWindow
// @grant		GM_addStyle
// @run-at      document-start
// @namespace https://greasyfork.org/users/452524
// ==/UserScript==

var gameScene = "menu";
var flowerLvl = 1;
const WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {
    set: (target, key, value) => {
        return true;
    },
    get: (target, key) => {
        if (key !== "__isProxy") {
            return target[key];
        }

        return true;
    },

    construct(target, args) {
        if (args[0] === 'noProxy') {
            if (target.__isProxy) {
                return Reflect.construct(target, args);
            } else {
                return Reflect.construct(target, args.slice(1));
            }
        }

        const instance = Reflect.construct(...arguments);

        const instanceProxy = new Proxy(instance.send, {
            apply(target, thisArg, args) {
                if (args[0] instanceof Int8Array && args[0][0] === 1) {
                    if (args[0].length === 11) {
                        const array1 = [...args[0].slice(3, 11)];
                        const array2 = new Array(8).fill(0);
                        if (!array1.every((value, index) => value === array2[index]) && gameScene == "menu") {
                            gameScene = "playing";
                            updateElems();
                        }
                        if (modal.style.pointerEvents != "none") {
                            args[0][10] = 0;
                        }
                    } else if (args[0].length == 2 && args[0].every((value, index) => value === [1,0][index])) {
                        gameScene = "menu";
                        updateElems();
                    } else if (args[0][1] == 6 && (lockedSlots[lockedSlots.length-1] || lockedSlots[args[0][2]] || lockedPetals[args[0][3]])) {
                        return;
                    }
                }

                return Reflect.apply(...arguments);
            }
        });

        instance.send = instanceProxy;

        instance.addEventListener("close", function() {
            gameScene = "menu";
            updateElems();
        })
        return instance;
    }
});

unsafeWindow.WebSocket = WebSocketProxy;

const CVS = !!unsafeWindow.OffscreenCanvasRenderingContext2D?"OffscreenCanvasRenderingContext2D":!!unsafeWindow.CanvasRenderingContext2D?"CanvasRenderingContext2D":"";

if (!!CVS) {
    const fillTextProxy = new Proxy(unsafeWindow[CVS].prototype.fillText, {
        set: (target, key, value) => {
            return true;
        },
        get: (target, key) => {
            if (key !== "__isProxy") {
                return target[key];
            }

            return true;
        },
        apply(target, thisArg, args) {
            if (args[0] === 'noProxy') {
                if (target.__isProxy) {
                    return Reflect.apply(target, thisArg, args);
                } else {
                    return Reflect.apply(target, thisArg, args.slice(1));
                }
            }
            if (!args[0].includes("-")) {
                if (args[0].includes("Lvl ") && args[0].includes(" Flower")) {
                    flowerLvl = Number(args[0].replace("Lvl ","").replace(" Flower",""));
                    updateLvl(flowerLvl);
                }
                if (args[0].includes("Lvl ") && args[0].includes(" Flower") && gameScene == "menu") {
                    gameScene = "playing";
                    updateElems();
                } else if (args[0].includes("Points: ") && args[0] != "Points: 0" && gameScene == "playing") {
                    gameScene = "death";
                    updateElems();
                }
            }
            return Reflect.apply(...arguments);
        }
    });
    unsafeWindow[CVS].prototype.fillText = fillTextProxy;
} else {
   alert(`Your browser doesn't support this script, try switching to Chrome or Firefox or uninstall the script nammed "${GM_info.script.name}"`)
}

GM_addStyle(`
.menu{
pointer-events: none; position: fixed; left:10px; color: rgba(255,255,255,0.5); font-style: normal; font-variant: normal;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;outline: 0;
}
* {
font-family: 'Ubuntu';
}
.modalLock {
width: 100%;
height: 100%;
position: absolute;
top: 0;
visibility: hidden;
opacity: 0;
transition: opacity 0.3s linear, visibility 0.3s;
}

.modalLock-content {
background-color: white;
display: flex;
flex-flow: column wrap;
justify-content: space-between;
align-items: center;
padding: 5px;
border-radius: 10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
margin-left: auto;
margin-right: auto;
margin-top: -400px;
transition: margin-top 0.3s linear;
}

.visible {
opacity: 1;
visibility: visible;
}

.visible .modalLock-content {
margin-top: 5%;
}

.close {
align-self: flex-end;
cursor: pointer;
}

.author {
align-self: flex-end;
color: grey;
font-size: 0.5em;
}

.inner {
display: flex;
flex-direction: initial;
}
.columnSquares {
display: flex;
flex-direction: initial;
}
.storedSlotImg {
margin-left: 5.3px;
margin-right: 5.3px;
width:38px;
}
.actSlotImg {
margin-left: 7px;
margin-right: 7px;
width:53.3px;
}
.galleryImg {
margin-left: 7px;
margin-right: 7px;
width:53.3px;
}
.nohighlightselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
`)

var hasMenuDisp = false;
var modal;

function updateLvl(lvl) {
    var i;
    if (lvl < 15) {
        for (i = 0; i < document.getElementById("actStols").childElementCount; i++) {
            document.getElementById("actStols").childNodes[document.getElementById("actStols").childElementCount-i].style.display = i < 3?"none":"block";
        }
    } else if (lvl < 30) {
        for (i = 0; i < document.getElementById("actStols").childElementCount; i++) {
            document.getElementById("actStols").childNodes[document.getElementById("actStols").childElementCount-i].style.display = i < 2?"none":"block";
        }
    } else if (lvl < 45) {
        for (i = 0; i < document.getElementById("actStols").childElementCount; i++) {
            document.getElementById("actStols").childNodes[document.getElementById("actStols").childElementCount-i].style.display = i < 1?"none":"block";
        }
    } else {
        for (i = 0; i < document.getElementById("actStols").childElementCount; i++) {
            document.getElementById("actStols").childNodes[document.getElementById("actStols").childElementCount-i].style.display = "block";
        }
    }
    var count = 0;
    for (i = 0; i < document.getElementsByClassName("slot").length; i++) {
        if (document.getElementsByClassName("slot")[i].style.display != "none") {
            var locked = lockedSlots[count];
            var curSlot = document.getElementsByClassName("slot")[i];
            curSlot.setAttribute("data-value",JSON.stringify([count,locked]));
            curSlot.src = slotSRC[locked?1:0];
            curSlot.title = locked?"click to unlock this slot":"click to lock this slot";
            count++
        }
    }
}
function updateElems() {
    GM_addStyle(`
.visible {
opacity: ${gameScene == "playing"?0.9:1};
visibility: visible;
}
`)
    if (!!document.getElementById("lockBanner")) {
        document.getElementById("lockBanner").innerHTML = `<p>•Press ${gameScene == "menu" && (!modal || !modal.classList.contains('visible'))?"[CTRL]+":""}[Minus] to ${!!modal && modal.classList.contains('visible')?"close":"open"} the petal locker settings</p>`;
    }
    if (!!document.getElementById("menuDisp") && hasMenuDisp) {
        document.getElementById("menuDisp").innerHTML = `<p>•Use ${gameScene == "menu"?"[CTRL]+":""}[Equal] key to toggle menu display</p>`;
    }
}
function isMouseInside(event,obj) {
    if (!!obj && event.clientX > obj.getBoundingClientRect().x && event.clientX < obj.getBoundingClientRect().x+obj.getBoundingClientRect().width && event.clientY > obj.getBoundingClientRect().y && event.clientY < obj.getBoundingClientRect().y+obj.getBoundingClientRect().height) {
        return true
    } else {
        return false
    }
}

var slotSRC = ["https://cdn.discordapp.com/attachments/729765325993672736/736529086565842974/slot.png","https://cdn.discordapp.com/attachments/729765325993672736/736537772495601753/slot_-_copie.png"];
var deleteSRC = ["https://cdn.discordapp.com/attachments/729765325993672736/736530137251577916/slot2.png","https://cdn.discordapp.com/attachments/729765325993672736/736537771719786586/slot2_-_copie.png"];
var petalsOrder = [5,30,27,23,25,28,17,15,19,12,26,22,21,9,29,24,4,11,10,31,14,20,13,18,16,7,6,32,8,3,2,1];
var petalsDatas = {
    5: {
        name: "Square",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654655702040606/Square.png","https://cdn.discordapp.com/attachments/729765325993672736/736878256522788905/Square.png"]
    },
    30: {
        name: "Legendary Web",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654652090744903/lWeb.png","https://cdn.discordapp.com/attachments/729765325993672736/736878260486406174/lWeb.png"]
    },
    27: {
        name: "Legendary Stinger",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654651562262548/Tringer.png","https://cdn.discordapp.com/attachments/729765325993672736/736878230425960468/Tringer.png"]
    },
    23: {
        name: "Legendary Egg",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654651138768977/lEgg.png","https://cdn.discordapp.com/attachments/729765325993672736/736878230069444618/lEgg.png"]
    },
    25: {
        name: "Antennae",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654649935003658/Antennae.png","https://cdn.discordapp.com/attachments/729765325993672736/736878218635771944/Antennae.png"]
    },
    28: {
        name: "Ying Yang",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654649821626368/Ying_Yang.png","https://cdn.discordapp.com/attachments/729765325993672736/736878217083748372/Ying_Yang.png"]
    },
    17: {
        name: "Triplet",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654645107228692/Triplet.png","https://cdn.discordapp.com/attachments/729765325993672736/736878214261243984/Triplet.png"]
    },
    15: {
        name: "Epic Rose",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736654640439099402/eRose.png","https://cdn.discordapp.com/attachments/729765325993672736/736878211459186708/eRose.png"]
    },
    19: {
        name: "Pollen",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706948275109938/Pollen.png","https://cdn.discordapp.com/attachments/729765325993672736/736878340237164574/Pollen.png"]
    },
    12: {
        name: "Epic Peas",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706946224095343/hippies.png","https://cdn.discordapp.com/attachments/729765325993672736/736878339406561370/hippies.png"]
    },
    26: {
        name: "Heaviest",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706945553268736/Heaviest.png","https://cdn.discordapp.com/attachments/729765325993672736/736878309316493392/Heaviest.png"]
    },
    22: {
        name: "Epic Egg",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706944806551703/eEgg.png","https://cdn.discordapp.com/attachments/729765325993672736/736878307773120592/eEgg.png"]
    },
    21: {
        name: "Epic Cactus",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706944525664406/eCactus.png","https://cdn.discordapp.com/attachments/729765325993672736/736878309102845952/eCactus.png"]
    },
    9: {
        name: "Wing",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706943233556500/Wing.png","https://cdn.discordapp.com/attachments/729765325993672736/736878304719536168/Wing.png"]
    },
    29: {
        name: "Rare Web",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706940817899520/rWeb.png","https://cdn.discordapp.com/attachments/729765325993672736/736878306368028702/rWeb.png"]
    },
    24: {
        name: "Rare Rose",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736706939794358383/rRose.png","https://cdn.discordapp.com/attachments/729765325993672736/736878303096602664/rRose.png"]
    },
    4: {
        name: "Rock",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853509307236352/Rock.png","https://cdn.discordapp.com/attachments/729765325993672736/736878299032322108/Rock.png"]
    },
    11: {
        name: "Rare Peas",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853504177471558/rPeas.png","https://cdn.discordapp.com/attachments/729765325993672736/736878295680942172/rPeas.png"]
    },
    10: {
        name: "Missile",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853499635302450/Missile.png","https://cdn.discordapp.com/attachments/729765325993672736/736878300378431518/Missile.png"]
    },
    31: {
        name: "Honey",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853493716877402/Honey.png","https://cdn.discordapp.com/attachments/729765325993672736/736878253393969223/Honey.png"]
    },
    14: {
        name: "Faster",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853487400517704/Faster.png","https://cdn.discordapp.com/attachments/729765325993672736/736878257189683280/Faster.png"]
    },
    20: {
        name: "Dandelion",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853469641834556/Dandelion.png","https://cdn.discordapp.com/attachments/729765325993672736/736878257252597790/Dandelion.png"]
    },
    13: {
        name: "Rare Cactus",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853461768994826/rCactus.png","https://cdn.discordapp.com/attachments/729765325993672736/736878297580961885/rCactus.png"]
    },
    18: {
        name: "Bubble",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853457176100945/Bubble.png","https://cdn.discordapp.com/attachments/729765325993672736/736878231336124476/Bubble.png"]
    },
    16: {
        name: "Twin",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853452851773510/Twin.png","https://cdn.discordapp.com/attachments/729765325993672736/736878263510499389/Twin.png"]
    },
    7: {
        name: "Unusual Stinger",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853449110585425/uStinger.png","https://cdn.discordapp.com/attachments/729765325993672736/736878263804362862/uStinger.png"]
    },
    6: {
        name: "Unusual Rose",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853443951722506/uRose.png","https://cdn.discordapp.com/attachments/729765325993672736/736878230581280788/uRose.png"]
    },
    32: {
        name: "Leaf",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853440172654652/Leaf.png","https://cdn.discordapp.com/attachments/729765325993672736/736878258951290910/Leaf.png"]
    },
    8: {
        name: "Iris",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853435852259328/Iris.png","https://cdn.discordapp.com/attachments/729765325993672736/736878264349622402/Iris.png"]
    },
    3: {
        name: "Heavy",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853432236769291/Heavy.png","https://cdn.discordapp.com/attachments/729765325993672736/736878257991057468/Heavy.png"]
    },
    2: {
        name: "Fast",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853428860354600/Fast.png","https://cdn.discordapp.com/attachments/729765325993672736/736878231289856000/Fast.png"]
    },
    1: {
        name: "Basic",
        scr: ["https://cdn.discordapp.com/attachments/729765325993672736/736853425622351922/Basic.png","https://cdn.discordapp.com/attachments/729765325993672736/736878231088660580/Basic.png"]
    }
}
var lockedSlots = !!localStorage.lockedSlots?JSON.parse(localStorage.lockedSlots):[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var lockedPetals = !!localStorage.lockedPetals?JSON.parse(localStorage.lockedPetals):[null,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
var toggleKey = "Minus";
document.addEventListener("DOMContentLoaded", function() {
    var i;
    var overlay = document.createElement("div");
    overlay.className = "menu";
    overlay.id = "lockBanner";
    overlay.innerHTML = `<p>•Press ${gameScene == "menu" && (!modal || !modal.classList.contains('visible'))?"[CTRL]+":""}[Minus] to ${!!modal && modal.classList.contains('visible')?"close":"open"} the petal locker settings</p>`;
    overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
    document.body.appendChild(overlay);
    if (!document.getElementById('menuDisp')){
        hasMenuDisp = true;
        overlay = document.createElement("div");
        overlay.innerHTML = `<p>•Use ${gameScene == "menu" && (!modal || !modal.classList.contains('visible'))?"[CTRL]+":""}[Equal] key to toggle menu display</p>`;
        overlay.id = "menuDisp";
        overlay.style.display = "none";
        document.body.appendChild(overlay);
        setTimeout(function(){
            overlay.style.display = "block";
            overlay.style.top = (30+document.getElementsByClassName("menu").length*20)+"px";
            overlay.className = "menu";
        },100)
    }
    var menuDisp = document.getElementById('menuDisp');
    var observer = new MutationObserver(function(){
        for (var i = 0; i < document.getElementsByClassName("menu").length; i++) {
            document.getElementsByClassName("menu")[i].style.display = menuDisp.style.display;
        }
    });
    observer.observe(menuDisp, { attributes: true, childList: true });
    onkeydown = function (e) {
        if (e.code == "Minus" && (e.ctrlKey || gameScene != "menu" || modal.classList.contains('visible'))) {
            e.preventDefault();
            toggleModal();
        } else if (!!menuDisp && (e.code == "Equal" && (e.ctrlKey || gameScene != "menu") || e.code == "Equal" && menuDisp.style.display == "none") && hasMenuDisp) {
            e.preventDefault();
            menuDisp.style.display = menuDisp.style.display != "none"? "none" : "block";
        }
    }
    modal = document.createElement("div");
    modal.classList.add("modalLock");
    modal.innerHTML = `
<div id="lockPetalModal" class='modalLock-content nohighlightselect' style="width: 550px;height: 465px;font-size:15px;background-image: linear-gradient(#5A9FDB, #1EA761);">
<span class='close'>&times;</span>
<span style="text-decoration: underline;">
Click on the petals you wish to lock/unlock:
</span>
<div class='columnSquares pgal' id="1galleryBoard">
</div>
<span style="text-decoration: underline;">
Click on the slots you wish to lock/unlock:
</span>
<div class='columnSquares' id="actStols">
</div>
<div class='columnSquares' id="invStols">
</div>
<span class='author' title='If you have any questions, suggestions, bug report, just wanna be friend or anything else you can contact me through discord using my username "woold#2808"' style="color:black">Made by <a href="https://greasyfork.org/en/users/452524-woold?site=florr.io" target="_blank">woold#2808</a></span>
</div>
`;
    document.body.appendChild(modal);
    document.addEventListener("mousemove", function(e){
        if (isMouseInside(e,document.getElementById("lockPetalModal")) && modal.style.pointerEvents == "none" && modal.classList.contains("visible")) {
            modal.style.pointerEvents = "";
        } else if (!isMouseInside(e,document.getElementById("lockPetalModal")) && modal.style.pointerEvents != "none") {
            modal.style.pointerEvents = "none";
        }
    })
    var galId = "1galleryBoard";
    for (i = 0; i < petalsOrder.length; i++) {
        if (!petalsDatas[petalsOrder[i]]) break;
        var petalElem = document.createElement("img");
        document.getElementById(galId).appendChild(petalElem);
        petalElem.outerHTML = `<img src="${petalsDatas[petalsOrder[i]].scr[lockedPetals[petalsOrder[i]]?1:0]}" class="galleryImg" id="${"petal"+i}" data-value="${JSON.stringify([petalsOrder[i],lockedPetals[petalsOrder[i]]])}" title="click to ${lockedPetals[petalsOrder[i]]?"unlock":"lock"} the ${petalsDatas[petalsOrder[i]].name} petal" ondragstart="return false;">`;
        if (document.getElementById(galId).childElementCount == 8 && !!petalsOrder[i+1]) {
            var newGalId = (Number((galId.match( /\d+/g )||[]).join(''))+1)+galId.replace((galId.match( /\d+/g )||[]).join(''),"")
            document.getElementById(galId).insertAdjacentHTML("afterend", `<div class='columnSquares pgal' id="${newGalId}"></div>`);
            galId = newGalId;
        }
        document.getElementById("petal"+i).addEventListener("click",function() {
            var id = JSON.parse(this.getAttribute("data-value"))[0];
            lockedPetals[id] = JSON.parse(this.getAttribute("data-value"))[1]?false:true;
            localStorage.lockedPetals = JSON.stringify(lockedPetals);
            this.setAttribute("data-value",JSON.stringify([id,lockedPetals[id]]));
            this.src = petalsDatas[id].scr[lockedPetals[id]?1:0];
            this.title = `click to ${lockedPetals[id]?"unlock":"lock"} the ${petalsDatas[id].name} petal`;
        })
    }
    var nSlot = lockedSlots.length;
    for (i = 0; i < nSlot; i++) {
        var columId = i < 8? "actStols" : "invStols";
        var slut = document.createElement("img");
        document.getElementById(columId).appendChild(slut);
        if (i != nSlot-1) {
            slut.outerHTML = `<img src="${slotSRC[lockedSlots[i]?1:0]}" class="${columId == "actStols"? "actSlotImg" : "storedSlotImg"} slot" id="slot${i}" data-value="${JSON.stringify([i,lockedSlots[i]])}" title="click to lock this slot" ondragstart="return false;">`;
        } else {
            slut.outerHTML = `<img src="${deleteSRC[lockedSlots[i]?1:0]}" class="storedSlotImg" id="slot${i}" data-value="${JSON.stringify([i,lockedSlots[i]])}" title="click to lock all slot" ondragstart="return false;">`;
        }
        document.getElementById("slot"+i).addEventListener("click",function() {
            var id = JSON.parse(this.getAttribute("data-value"))[0];
            var index = Number(this.id.replace("slot",""));
            lockedSlots[id] = JSON.parse(this.getAttribute("data-value"))[1]?false:true;
            localStorage.lockedSlots = JSON.stringify(lockedSlots);
            this.setAttribute("data-value",JSON.stringify([id,lockedSlots[id]]));
            this.src = index != nSlot-1?slotSRC[lockedSlots[id]?1:0]:deleteSRC[lockedSlots[id]?1:0];
            this.title = index != nSlot-1?lockedSlots[id]?"click to unlock this slot":"click to lock this slot":lockedSlots[id]?"click to unlock all non-locked slot":"click to lock all slot";
        })
    }
    var closeModal = () => {
        if (modal.classList.contains('visible')) {
            modal.classList.remove("visible");
        }
        document.getElementById("lockBanner").innerHTML = `<p>•Press ${gameScene == "menu" && (!modal || !modal.classList.contains('visible'))?"[CTRL]+":""}[Minus] to ${!!modal && modal.classList.contains('visible')?"close":"open"} the petal locker settings</p>`;
    };

    var toggleModal = () => {
        modal.classList.toggle("visible");
        document.getElementById("lockBanner").innerHTML = `<p>•Press ${gameScene == "menu" && (!modal || !modal.classList.contains('visible'))?"[CTRL]+":""}[Minus] to ${!!modal && modal.classList.contains('visible')?"close":"open"} the petal locker settings</p>`;
    };

    var handleKeypress = (e) => {
        let key = e.code;
        switch (key) {
            case "Escape":
                if (modal.classList.contains('visible')) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeModal();
                }
                break;
            default:
                break;
        }
    };

    document.addEventListener("keydown", handleKeypress);
    document.querySelector(".close").addEventListener("click", closeModal);
})
