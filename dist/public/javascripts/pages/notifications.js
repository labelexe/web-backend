"use strict";$("#containingItemsDiv").empty(),window.offset=0,loadMessages(),$("#openMessages").click(function(){$("#containingItemsDiv").empty(),window.offset=0,loadMessages()}),$("#openFriends").click(function(){$("#containingItemsDiv").empty(),window.offset=0,loadFriends()}),$(document).on("click",".loadMoreItems",function(){loadMessages()}),$(document).on("click",".loadMoreFriends",function(){loadFriends()}),$(document).on("click",".acceptFriendRequest",function(){var a=$(this).attr("data-userid"),b=$(this).parent().parent().parent().parent();request("/user/"+a+"/friend/","PUT").then(function(){toast(!0,"The friend request has been accepted!"),b.remove()})["catch"](function(){b.remove(),void 0,toast(!1,"The request couldn't be accepted. Please try again later.")})}),$(document).on("click",".declineFriendRequest",function(){var a=$(this).attr("data-userid"),b=$(this).parent().parent().parent().parent();request("/user/"+a+"/friend/","DELETE").then(function(){toast(!0,"The friend request has been declined."),b.remove()})["catch"](function(){b.remove(),void 0,toast(!1,"The request couldn't be declined. Please try again later.")})});function loadFriends(){$(".loadMoreItems").hide(),request("/notifications/requests","GET").then(function(a){0>=a.length&&0===window.offset&&$("#containingItemsDiv").append("<div class=\"col-sm-12\"><h5 class=\"text-center\" style=\"margin-top:1rem;\">You do not have any friend requests.</h5></div>");var b=[];25<=a.length?($(".loadMoreItems").show(),window.offset+=25):window.offset=0,a.forEach(function(a){b.push(a.userId),$("#containingItemsDiv").append("<div class=\"col-sm-12 col-md-6 col-lg-3\"><div class=\"card\" style=\"margin: 1rem 0px;\"><img style=\"width:100%;\" data-userid=\""+a.userId+"\" /> <div class=\"card-body\"><div class=\"card-title text-left text-truncate\" style=\"margin-bottom:0;\"><a href=\"/users/"+a.userId+"/profile\" data-userid=\""+a.userId+"\"></a></div><div class=\"row\"><div class=\"col-sm-6\"><button type=\"button\" class=\"btn btn-success acceptFriendRequest\" style=\"margin:0auto;display:block;width: 100%;\" data-userid=\""+a.userId+"\">Accept</button></div><div class=\"col-sm-6\"><button type=\"button\" data-userid=\""+a.userId+"\" class=\"btn btn-danger declineFriendRequest\" style=\"margin:0auto;display:block;width: 100%;\">Decline</button></div></div></div></div></div>")}),setUserNames(b),setUserThumbs(b)})["catch"](function(){0===window.offset&&$("#containingItemsDiv").append("<div class=\"col-sm-12\"><h5 class=\"text-center\" style=\"margin-top:1rem;\">You do not have any friend requests.</h5></div>")})}function loadMessages(){$(".loadMoreItems").hide(),request("/notifications/messages?offset="+window.offset,"GET").then(function(a){0>=a.length&&0===window.offset&&$("#containingItemsDiv").append("<div class=\"col-sm-12\"><h5 class=\"text-center\" style=\"margin-top:1rem;\">You do not have any messages.</h5></div>");var b=[];0===window.offset&&$("#containingItemsDiv").append("<div class=\"col-12\"><table class=\"table\">\n                <thead>\n                    <tr>\n                        <th scope=\"col\">From</th>\n                        <th scope=\"col\">Subject</th>\n                        <th scope=\"col\">Date</th>\n                    </tr>\n                </thead>\n                <tbody id=\"messagesFromDiv\"></tbody></table></div>"),a.forEach(function(a){b.push(a.userId),0===a.read?$("#messagesFromDiv").append("<tr data-id=\""+a.messageId+"\" data-userid=\""+a.userId+"\" style=\"cursor: pointer;\" class=\"onClickShowMessage\" data-msgbody=\""+a.body.escape()+"\"><th scope=\"row\"><p data-userid=\""+a.userId+"\"></p></th><th scope=\"row\">"+a.subject.escape()+"</th><th scope=\"row\">"+formatDate(a.date)+"</th></tr>"):$("#messagesFromDiv").append("<tr data-userid=\""+a.userId+"\" style=\"cursor: pointer;\" class=\"onClickShowMessage\" data-msgbody=\""+a.body.escape()+"\"><td scope=\"row\"><p data-userid=\""+a.userId+"\"></p></tdt><td scope=\"row\">"+a.subject.escape()+"</td><td scope=\"row\">"+formatDate(a.date)+"</td></tr>")}),setUserNames(b),25<=a.length?($(".loadMoreItems").show(),window.offset+=25):window.offset=0})["catch"](function(){$("#containingItemsDiv").empty(),0===window.offset&&$("#containingItemsDiv").append("<div class=\"col-sm-12\"><h5 class=\"text-center\" style=\"margin-top:1rem;\">You do not have any messages.</h5></div>")})}$(document).on("click",".goBackButton",function(){$("#containingItemsDiv").empty(),$(".goBackButton").hide(),window.offset=0,loadMessages()}),$(document).on("click",".onClickShowMessage",function(){var a=$(this).attr("data-msgbody"),b=$(this).attr("data-userid"),c=$(this).attr("data-id");$("#messagesFromDiv").find(".messageDisplay").length||($("html, body").animate({scrollTop:0},"medium"),$(this).parent().parent().empty(),$("#containingItemsDiv").append("<div class=\"messageDisplay\"><div class=\"row\"><div class=\"col-3 col-md-2 col-lg-1\"><img style=\"width:100%\" data-userid="+b+" /></div><div class=\"col\"><p style=\"white-space:pre-wrap;\">"+a.escape()+"</p></div></div></div>"),$(".loadMoreItems").hide(),$(".goBackButton").show(),setUserThumbs([b]),$(this).find("th").length&&request("/notifications/message/"+c+"/read","PATCH").then(function(){})["catch"](function(){}))});








































