"use strict";$(document).on("click","#updateStatusClick",function(){var a=$("#newStatusValue").val();""!==a&&1<=a.length&&255>=a.length?request("/status","PATCH",JSON.stringify({status:a})).then(function(){success("Success! Your status has been updated.")})["catch"](function(a){warning(a.responseJSON.message)}):warning("Error: Your status must be between 1 and 255 characters. Please try again.")}),$(function(){function a(a){$("#feedLoader").show(),b=!0,request("/feed?offset="+a,"GET").then(function(d){c+=25;var e=[];d.forEach(function(a){e.push(a.userId);var b=moment(a.date).format("MMMM Do YYYY, h:mm a");$("#userFeedDiv").append("<div class=\"col-sm-12\"><hr /></div><div style=\"\" class=\"col-4 col-lg-2\"><img style=\"width:100%;\" data-userid=\""+a.userId+"\" src=\""+window.subsitutionimageurl+"\" /></div><div class=\"col-8 col-lg-10\"><div class=\"row\"><div class=\"col-12\"><a style=\"color:#212529;\" href=\"/users/"+a.userId+"/profile\"><h6 class=\"text-left\" style=\"margin-bottom: 0;\" data-userid=\""+a.userId+"\"></h6></a></div><div class=\"col-12\"><p class=\"text-left\" style=\"font-size: small;\">"+b+"</p></div><div class=\"col-12 col-sm-9 col-lg-10\"><p>"+a.status.escape()+"</p></div></div></div>")}),setUserThumbs(e),setUserNames(e),0<d.length?($("#feedLoader").show(),b=!1):$("#feedLoader").hide(),0===d.length&&0===a&&$("#userFeedDiv").append("<div class=\"col-12\">Your feed is empty. Make some friends!</div>")})["catch"](function(b){0===a&&$("#userFeedDiv").append("<div class=\"col-12\">"+b.responseJSON.message+"</div>")})}request("/user/"+userId+"/info","GET").then(function(a){null!==a.user_status&&""!==a.user_status&&$("#newStatusValue").attr("placeholder",a.user_status.escape())})["catch"](function(){}),request("/user/"+userId+"/friends?limit=5","GET").then(function(a){$("#userFriendsCountDiv").empty(),$("#userFriendsDiv").empty(),$("#userFriendsCountDiv").append("<p>"+a.total+"</p>");var b=[];$(a.friends).each(function(a,c){4>=a&&(null===c.UserStatus&&(c.UserStatus="..."),b.push(c.userId),$("#userFriendsDiv").append("<div class=\"row\"><div class=\"col-6 col-sm-3 text-center\" ><img src=\""+window.subsitutionimageurl+"\" data-userid=\""+c.userId+"\" class=\"card-img-top\"></div><div class=\"col text-left\"><a href=\"/users/"+c.userId+"/profile\"><span data-userid=\""+c.userId+"\"></span></a><p>&quot;"+c.UserStatus.escape()+"&quot;</p></div></div>"))}),4<a.friends.length&&$("#userFriendsDiv").append("<div class=\"row\"><div class=\"col-sm-12 text-left\"><a href=\"/users/"+userId+"/friends\">See All</a></div></div>"),setUserThumbs(b),setUserNames(b),$("#myFriendsCount").html("("+a.total+")"),0===a.total&&($("#userFriendsDiv").append("You do not have any friends."),$("#userFriendsDiv").css("padding-top","0"))})["catch"](function(){void 0,$("#userFriendsCountDiv").empty(),$("#userFriendsDiv").empty(),$("#userFriendsDiv").append("You do not have any friends."),$("#userFriendsDiv").css("padding-top","0"),$("#userFriendsCountDiv").append("<p>0</p>")});var b=!1,c=0;$(window).scroll(function(){$(window).scrollTop()+$(window).height()>$(document).height()-400&&!b&&a(c)}),a(0)});






































