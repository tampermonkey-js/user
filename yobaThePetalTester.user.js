// ==UserScript==
// @name         Yoba the petal tester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       woold the guy who can't get legs
// @match        https://florr.io/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

if (!GM_getValue("trashPetalList")) {
    GM_setValue("trashPetalList",{});
}


function showList() {
    var listText = "";
    for (var val in GM_getValue("trashPetalList")) {
        listText += GM_getValue("trashPetalList")[val]+": "+val+"  ";
    }
    listText = listText.trim();
    if (!!listText) {
        alert("Your petal list is '"+listText+"'");
    } else {
        alert("Hello YOBA, everytime you will load florr.io or press [L] your petal list, if its not empty, will be displayed instead of this text. You can start by trashing a Basic! Everytime you want to trash an undiscovered petal, it won't actually be trashed but beware not to trash known petals, for that you can check your discovered list if not empty by pressing [L]");
    }
}

document.addEventListener("keydown",function(e) {
    if (e.code == "KeyL") {
        showList();
    }
})

if (!localStorage.yobaWasPetalTester) {
    localStorage.yobaWasPetalTester = "true";
    showList();
}

function newPet(num) {
    var tp = prompt("You trashed an unknown petal with the value of: "+num+", enter his exact name below and if needed his rarity for example: 'Rose (Rare)' (press [Escape] if you want to cancel)");
    if (["rose","web","cactus","peas","egg","stinger"].includes(tp.trim().toLowerCase())) {
        alert("You need to justify the rarity for example: 'Rose (Rare)'")
        newPet(num);
    } else if (!!tp) {
        var trashPetalList = GM_getValue("trashPetalList");
        trashPetalList[num] = tp.trim();
        GM_setValue("trashPetalList",trashPetalList);
    }
}


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
                    if (args[0].length == 4) {
                        if (!GM_getValue("trashPetalList")[args[0][3]]) {
                            newPet(args[0][3]);
                            return;
                        }
                    }
                }
                return Reflect.apply(...arguments);
            }
        });

        instance.send = instanceProxy;

        return instance;
    }
});

unsafeWindow.WebSocket = WebSocketProxy;
