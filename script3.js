localStorage.transfered&&"true"==localStorage.transfered&&(onkeydown=function(e){13==e.keyCode&&e.stopImmediatePropagation()},setTimeout(function(){onkeydown=void 0},6e3)),window.onbeforeunload=function(e){localStorage.transfered&&"true"==localStorage.transfered&&(e.stopImmediatePropagation(),e.preventDefault(),e.stopPropagation())};var firstConnect=!1,disconnected=!1,socketDisconnected=!0,socket=io("https://florrio-transfer-party.glitch.me",{transports:["websocket"]});socket.on("wrongPW",function(){alert("the password is wrong, try again"),receive()}),socket.on("receivedDatas",function(e){e==localStorage.cp6_player_id?alert("you're kinda dumb, if you want to test the script dont do it in the same window, open a new incognito window"):(socket.emit("disconnectOtherUser",[e,localStorage.florrio_nickname]),localStorage.cp6_player_id=e,localStorage.transfered=!0,window.location.reload())}),socket.on("disconnectUser",function(e){delete localStorage.cp6_player_id,k.globalCtors(),disconnected=!0,alert(`your current party has been succesfully transfered to a player with the username of "${e}"!`),alert("you are now disconnected from florr.io, you can mess around with your frozen flower or get transfered another party, or refresh to play normally")}),socket.on("disconnect",function(){socketDisconnected=!0,clearTimeout(e);var e=setTimeout(function(){socketDisconnected&&alert("You have been disconnected from the transfering server for 20 seconds, the transfering servers might be down, go ping woold#2808 on discord!")},2e4)});var curPassword="";function send(){if(disconnected)alert("you dummy wanna transfer a frozen flower... XD so dumb");else{var e=prompt(`Enter a password that you will share with the account receiver. ${curPassword?`Your current password is "${curPassword}"`:""}`,localStorage.curPassword||curPassword);null!=e&&""!=e?(socket.emit("partyInfos",[localStorage.cp6_player_id,e]),localStorage.curPassword=e,curPassword=localStorage.curPassword,alert(`Password succesfully set to "${curPassword}"`)):null!=e&&alert("the procedure has been canceled due to the lack of password")}}var lastPassword="";function receive(){var e=prompt("Enter the password that has been given by the account sender",lastPassword);null!=e&&""!=e?(socket.emit("password",e),lastPassword=e):null!=e&&alert("the procedure has been canceled due to the lack of password")}socket.on("connect",function(){socketDisconnected=!1,firstConnect||(firstConnect=!0,localStorage.transfered&&"false"!=localStorage.transfered?localStorage.transfered=!1:(alert("When you want to send your account to another computer Press [K] and follow the instruction"),alert("When you want to receive an account from another computer Press [L] and follow the instruction")),window.addEventListener("keydown",function(e){"KeyK"==e.code?send():"KeyL"==e.code&&receive()}))});
