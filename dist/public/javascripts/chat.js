"use strict";if("localhost"!==window.location.host.slice(0,9))var wsurl="wss://"+window.location.host+"/chat/websocket.aspx";else var wsurl="ws://localhost:8080/chat/websocket.aspx";var currentlyDisplayedUserIds=[],curChatOffset=0,canLoadMore=!1,latestMessage={};function getCsrf(){return new Promise(function(a){$.ajax({type:"POST",url:"/api/v1/chat/metadata",data:"",complete:function complete(b){a(b.getResponseHeader("X-CSRF-Token"))}})})}function chatInit(){function a(){return m?void $("#chatModalTextBar").html("<i class=\"fas fa-comments\"></i> Chat <span class=\"badge badge-dark\">("+m+" Unread)</span>"):void $("#chatModalTextBar").html("<i class=\"fas fa-comments\"></i> Chat")}function b(){request("/chat/unread/count","GET").then(function(b){m=b.total,a()})["catch"](function(){})}function c(a){return!("true"!==a)}function d(){r||(r=!0,setTimeout(function(){e(),r=!1},1500))}function e(){getCsrf().then(function(a){n&&j(n);var b=new WebSocket(wsurl+"?csrf="+a);b.onmessage=function(a){var b=JSON.parse(a.data);g(b),localStorage.setItem("notifSystemJson",a.data)},b.onopen=function(){s||localStorage.setItem("notifSystemInUse",!0)},b.onclose=function(a){s||d(a)},b.onerror=function(a){s||d(a)},window.onbeforeunload=function(){s=!0,localStorage.setItem("notifSystemInUse",!1),b.close()}})}function f(a){"notifSystemJson"===a.key?g(JSON.parse(a.newValue)):"notifSystemInUse"===a.key&&!1===c(localStorage.getItem("notifSystemInUse"))&&e()}function g(b){if(!b.chatMessageId){var c=b.typing;b.userIdFrom===n&&1===c&&(t=moment())}else b.userIdFrom===n?(t=!1,$("#partnerChatStatus").css("opacity",0),k([b])):(m+=1,a())}function h(){request("/chat/latest","GET").then(function(a){if(0===a.length)return void $("#chatUsersLatest").append("<div class=\"row\"><div class=\"col-12\"><p class=\"text-center\">N/A</p></div></div>");var b=0,c=!0,d=!1,e=void 0;try{for(var f,g,h=a[Symbol.iterator]();!(c=(f=h.next()).done);c=!0){g=f.value,b++;var j=b,k=g.userIdTo;(k===userId&&(k=g.userIdFrom),!currentlyDisplayedUserIds.includes(k))&&(currentlyDisplayedUserIds.push(k),$("#latestChatUsers").append("<div class=\"row userChatCard\" style=\"cursor:pointer;\" data-userid=\"".concat(k,"\"></div>")),latestMessage=g,latestMessage?(latestMessage=latestMessage.content,!latestMessage&&(latestMessage="")):latestMessage="",$("#latestChatUsers").find(".userChatCard[data-userid=\""+k+"\"]").append("\n                            <div class=\"col-4\">\n                                <img data-userid=\"".concat(k,"\" style=\"width:100%;max-width:50px;margin:0 auto;display: block;\" />\n                            </div>\n                            <div class=\"col-8\">\n                                <p data-userid=\"").concat(k,"\" class=\"text-truncate\" style=\"font-weight:500;\">Loading...</p>\n                                <p class=\"chatMessageTrunc text-truncate\" style=\"font-size: small;\">").concat(latestMessage.escape(),"</p>\n                            </div>\n                            <div class=\"col-12\">\n                                <hr style=\"margin: 0.05rem;\" />\n                            </div>\n                        ")),j===a.length&&(setUserThumbs(currentlyDisplayedUserIds),setUserNames(currentlyDisplayedUserIds),i(0)))}}catch(a){d=!0,e=a}finally{try{c||null==h["return"]||h["return"]()}finally{if(d)throw e}}})["catch"](function(){void 0,i(0)})}function i(a){canLoadMore=!1,request("/user/"+userId+"/friends?offset="+a,"GET").then(function(a){if(25<=a.friends.length&&(canLoadMore=!0,curChatOffset+=25),0===a.total)$("#chatUsers").append("<div class=\"row\"><div class=\"col-12\"><p class=\"text-center\">Make some Friends to chat with them!</p></div></div>");else{var b=[];a.friends.forEach(function(a){currentlyDisplayedUserIds.includes(a.userId)||(currentlyDisplayedUserIds.push(a.userId),b.push(a.userId),(!a.UserStatus||null===a.UserStatus||void 0===a.UserStatus)&&(a.UserStatus=""),$("#chatUsers").append("\n                        <div class=\"row userChatCard\" style=\"cursor:pointer;\" data-userid=\"".concat(a.userId,"\">\n                            <div class=\"col-4\">\n                                <img data-userid=\"").concat(a.userId,"\" style=\"width:100%;max-width:50px;margin:0 auto;display: block;\" />\n                            </div>\n                            <div class=\"col-8\">\n                                <p data-userid=\"").concat(a.userId,"\" class=\"text-truncate\" style=\"font-weight:500;\">Loading...</p>\n                                <p class=\"chatMessageTrunc text-truncate\" style=\"font-size: small;\">").concat(a.UserStatus.escape(),"</p>\n                            </div>\n                            <div class=\"col-12\">\n                                <hr style=\"margin: 0.05rem;\" />\n                            </div>\n                        </div>\n                        ")))}),setUserNames(b),setUserThumbs(b)}})["catch"](function(){})}function j(a){o&&(localStorage.setItem("ChatModalOpenUserId",a),o=!1,request("/chat/"+a+"/history?offset="+p,"GET").then(function(c){0===c.length?void 0:(k(c),25<=c.length,request("/chat/"+a+"/read","PATCH").then(function(){b()})["catch"](function(){}))})["catch"](function(){}))}function k(a){userId=parseInt(userId);var b=[];a=a.reverse(),a.forEach(function(a){b.push(a.userIdFrom),b.push(a.userIdTo),a.UserStatus||(a.UserStatus="");var c="";c=a.userIdFrom===userId?"text-right":"text-left",u===a.userIdFrom?$("#dmchatmessages").append("\n                    <div class=\"row userChatMessageCard\" style=\"cursor:pointer;\" data-userid=\"".concat(a.userIdFrom,"\">\n                        <div class=\"col-12\" style=\"padding: 0;padding-right:0.25rem;padding-left:0.25rem;\">\n                            <p class=\"text ").concat(c,"\" style=\"font-size: small;\">").concat(a.content.escape(),"</p>\n                        </div>\n                    </div>\n                    ")):$("#dmchatmessages").append("\n                    <div class=\"row userChatMessageCard\" style=\"cursor:pointer;\" data-userid=\"".concat(a.userIdFrom,"\">\n                        <div class=\"col-12\" style=\"padding: 0;padding-right:0.25rem;padding-left:0.25rem;\">\n                            <a href=\"/users/").concat(a.userIdFrom,"/profile\"><p data-userid=\"").concat(a.userIdFrom,"\" class=\"text-truncate ").concat(c,"\" style=\"font-weight:500;\">Loading...</p></a>\n                            <p class=\"text ").concat(c,"\" style=\"font-size: small;\">").concat(a.content.escape(),"</p>\n                        </div>\n                        <div class=\"col-12\">\n                        </div>\n                    </div>\n                    ")),u=a.userIdFrom}),setUserNames(b),setUserThumbs(b),$("#dmchatmessages").scrollTop($("#dmchatmessages")[0].scrollHeight)}function l(){v=!1,$("#chatMessageContent").attr("disabled","disabled"),$("#sendChatMessage").attr("disabled","disabled");var a=$("#chatMessageContent").val();request("/chat/"+n+"/send","PUT",JSON.stringify({content:a})).then(function(){$("#chatMessageContent").val(""),$("#chatMessageContent").removeAttr("disabled"),$("#sendChatMessage").removeAttr("disabled"),k([{chatMessageId:0,userIdFrom:userId,userIdTo:n,content:a,dateCreated:moment().format("YYYY-MM-DD HH:mm:ss"),read:0}]),$("#chatMessageContent").focus()})["catch"](function(a){warning(a.responseJSON.message),$("#chatMessageContent").removeAttr("disabled"),$("#sendChatMessage").removeAttr("disabled")})}if("/Membership/NotApproved.aspx"!==window.location.pathname&&wsSupported){var m=0,n=0,o=!0,p=0,q=parseInt(localStorage.getItem("ChatModalOpenUserId"));$("body").append("<div class=\"d-none d-lg-flex row fixed-bottom\" style=\"z-index:999999;pointer-events: none;\" id=\"chatModalComplete\">\n<div class=\"col-6 col-md-4 col-xl-3\">\n    <div class=\"card\" style=\"box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.075);pointer-events: all;max-width: 300px;float: right;\">\n        <div class=\"card-body bg-success\" style=\"padding: 0.75rem;\">\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <p style=\"cursor: pointer;color: white;\" id=\"chatModalTextBar\" data-open=\"false\"><i class=\"fas fa-comments\"></i> Chat</p>\n                </div>\n            </div>\n        </div>\n        <div id=\"scrollingDivForAllChatUsersList\" class=\"card-body\" style=\"\n        padding: 0;    \n        max-height: 300px;\n        overflow-y: scroll;\n        overflow-x: hidden;\n        \">\n\n            <div class=\"row\" id=\"latestChatUsersParent\" style=\"display:none;\">\n                <div class=\"col-12\">\n                    <h5 style=\"padding-left:1rem;\">Latest Chats</h5>\n                </div>\n                <div class=\"col-12\" id=\"latestChatUsers\">\n\n                </div>\n            </div>\n\n            <div class=\"row\" id=\"chatUsersParent\" style=\"display:none;\">\n                <div class=\"col-12\">\n                    <h5 style=\"padding-left:1rem;\">Friends</h5>\n                </div>\n                <div class=\"col-12\" id=\"chatUsers\">\n\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n</div>"),$("#chatModalComplete").prepend("\n<div class=\"col-6 col-md-4 offset-md-4 col-xl-3 offset-xl-6\">\n    <div class=\"card\" style=\"box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.075);display:none;pointer-events: all;max-width: 300px;float: right;\" id=\"chatDMModal\">\n        <div class=\"card-body bg-success\" style=\"padding: 0.75rem;\">\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <p style=\"cursor: pointer;color: white;\" id=\"chatusername\"></p>\n                </div>\n            </div>\n        </div>\n        <div class=\"card-body\" style=\"padding: 0;padding-left:1rem;padding-right:1rem;\">\n            <div class=\"row\" style=\"min-height:300px;max-height:300px;\">\n                <div class=\"col-12\" id=\"dmchatmessages\" style=\"height:225px;overflow-y: scroll;\">\n\n                </div>\n                <div class=\"col-12\" id=\"partnerChatStatus\" style=\"padding: 0;padding-left:0.25rem;padding-right:0.25rem;opacity: 0;\">\n                    <p>User is typing...</p>\n                </div>\n                <div class=\"col-10\" id=\"dmchattextbox\" style=\"height:50px;padding: 0;\">\n                    <div class=\"form-group\" style=\"padding:0;margin-bottom:0;\">\n                        <textarea style=\"height:50px;padding:0;resize: none;\" class=\"form-control\" id=\"chatMessageContent\" rows=\"3\"></textarea>\n                    </div>\n                </div>\n                <div class=\"col-2\" style=\"padding: 0;\">\n                    <button type=\"button\" class=\"btn btn-success\" id=\"sendChatMessage\" style=\"margin:0auto;display:block;width: 100%;height:100%;padding-left: 0;padding-right: 0;margin:0;\"><i class=\"fas fa-sign-in-alt\"></i>\n\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n"),b(),localStorage.getItem("notifSystemInUse")||localStorage.setItem("notifSystemInUse",!1),!1===c(localStorage.getItem("notifSystemInUse"))?e():(void 0);var r=!1,s=!1;window.addEventListener("storage",f,!1);var t=!1;setInterval(function(){$("#partnerChatStatus").css("opacity",0)},250),0===q||isNaN(q)||($("#chatModalTextBar").attr("data-open","true"),$("#chatUsersParent").show(),$("#latestChatUsersParent").show(),$("#chatDMModal").show(),n=q,j(n),$("#chatDMModal").find(".card-body").first().find(".row").first().find(".col-12").first().find("p").first().attr("data-userid",q),setUserNames([q])),$(document).on("click","#chatModalTextBar",function(){"false"===$(this).attr("data-open")?($(this).attr("data-open","true"),$("#chatUsersParent").show(),$("#latestChatUsersParent").show()):($(this).attr("data-open","false"),$("#chatUsersParent").hide(),$("#latestChatUsersParent").hide(),$("#chatDMModal").hide(),n=0,p=0,localStorage.setItem("ChatModalOpenUserId",0))}),h(),$("#scrollingDivForAllChatUsersList").on("scroll",function(){$(this).scrollTop()+$(this).innerHeight()>=$(this)[0].scrollHeight&&canLoadMore&&i(curChatOffset)}),$(document).on("click",".userChatCard",function(a){a.preventDefault(),n=parseInt($(this).attr("data-userid")),$("#chatDMModal").show(),$("#chatusername").html($(this).find(".col-8").first().find("p").first().html()),$("#dmchatmessages").empty(),o=!0,p=0,j(n)}),$(document).on("click","#chatusername",function(a){a.preventDefault(),n=0,p=0,$("#chatDMModal").hide()});var u=0;$(document).on("click","#sendChatMessage",function(a){a.preventDefault(),l()});var v=!1;$("#chatMessageContent").on("keypress",function(a){v=moment(),13===a.which&&l()}),setInterval(function(){v&&v.add(1,"seconds").isSameOrAfter(moment())&&(v=!1,0!==n&&request("/chat/"+n+"/typing","PUT",JSON.stringify({typing:1})).then(function(){})["catch"](function(){}))},1e3)}}chatInit();






























