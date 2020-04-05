"use strict";var userData=$("#userdata"),userid=userData.attr("data-userid"),traderData=$("#tradedata"),traderId=traderData.attr("data-userid"),CurrentOffer=[],inOffer=function(a){var b=!0,c=!1,d=void 0;try{for(var e,f,g=CurrentOffer[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)if(f=e.value,f.userInventoryId===a)return!0}catch(a){c=!0,d=a}finally{try{b||null==g["return"]||g["return"]()}finally{if(c)throw d}}return!1},CurrentRequest=[],inRequest=function(a){var b=!0,c=!1,d=void 0;try{for(var e,f,g=CurrentRequest[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)if(f=e.value,f.userInventoryId===a)return!0}catch(a){c=!0,d=a}finally{try{b||null==g["return"]||g["return"]()}finally{if(c)throw d}}return!1},loadItems=function(a){if(!a.isLoading){a.isLoading=!0;var b=$(a.div).innerHeight(),c=Math.round(b/2-16)+"px",d=Math.round(b/2-16)+"px";$(a.div).empty(),$(a.div).append("\n    \n    <div class=\"col-12\" style=\"margin-top:".concat(c,";margin-bottom:").concat(d,";\">\n        <div class=\"spinner-border\" role=\"status\" style=\"margin:0 auto;display: block;\">\n            <span class=\"sr-only\">Loading...</span>\n        </div>\n    </div>\n    \n    "));var e="";return a.query&&(e=a.query),request("/user/"+a.userId+"/inventory/collectibles?limit=6&offset="+a.offset+"&query="+e,"GET").then(function(b){if($(a.div).empty(),a.isLoading=!1,0===b.items.length)return $(a.div).parent().find("span.next-page").css("opacity","0.5"),$(a.div).append("\n            \n            <div class=\"col-12\" style=\"margin-top:8rem;margin-bottom:8rem;\">\n                <p style=\"text-align:center;\">Oops, it looks like there aren't any items to show.</p>\n            </div>\n            \n            "),void(a.areMoreAvailable=!1);var c=[],d=!0,e=!1,f=void 0;try{for(var g,h,i=b.items[Symbol.iterator]();!(d=(g=i.next()).done);d=!0){h=g.value,c.push(h.catalogId);var j="";h.serial&&(j="<p style=\"font-size:0.65rem;margin-bottom:-1rem;margin-left:0.15rem;z-index:2;\" class=\"text-truncate\">Serial: ".concat(number_format(h.serial),"</p>"));var k="trade-item-".concat(a.div.slice(1));(inOffer(h.userInventoryId)||inRequest(h.userInventoryId))&&(k="remove-item-".concat(a.div.slice(1)," item-in-trade-request-or-offer")),$(a.div).append("\n            \n            <div class=\"col-6 col-md-4 trade-card-hover ".concat(k,"\" style=\"margin-bottom:1rem;\" \n            data-userinventoryid=\"").concat(h.userInventoryId,"\" \n            data-serial=\"").concat(h.serial,"\"\n            data-catalogname=\"").concat(xss(h.catalogName),"\"\n            data-catalogid=\"").concat(h.catalogId,"\"\n            data-averageprice=\"").concat(h.averagePrice,"\"\n            >\n                <div class=\"card\">\n                    ").concat(j,"\n                    <img src=\"").concat(window.subsitutionimageurl,"\" style=\"width:100%;height:auto;margin:0 auto;display:block;max-width:100px;\" data-catalogid=\"").concat(h.catalogId,"\" />\n                    <p style=\"font-size:0.85rem;font-weight:500;\" class=\"text-truncate\">").concat(xss(h.catalogName),"</p>\n                    <p style=\"font-size:0.65rem;\" class=\"text-truncate\">").concat(formatCurrency(1,"0.65rem")," ").concat(number_format(h.averagePrice),"</p>\n                </div>\n            </div>\n            \n            "))}}catch(a){e=!0,f=a}finally{try{d||null==i["return"]||i["return"]()}finally{if(e)throw f}}setCatalogThumbs(c),0===a.offset?$(a.div+"-pagination").find(".previous-page").css("opacity","0.5"):$(a.div+"-pagination").find(".previous-page").css("opacity","1"),b.areMoreAvailable?(a.areMoreAvailable=!0,a.offset+=6,$(a.div+"-pagination").find(".next-page").css("opacity","1")):(a.areMoreAvailable=!1,$(a.div+"-pagination").find(".next-page").css("opacity","0.5"))})["catch"](function(){a.isLoading=!1})}},currentUserPager={isLoading:!1,userId:userid,offset:0,query:void 0,div:"#requester-items",areMoreAvailable:!0};loadItems(currentUserPager);var partnerPager={isLoading:!1,userId:traderId,offset:0,query:void 0,div:"#requestee-items",areMoreAvailable:!0};loadItems(partnerPager),$("#search-requester-click").click(function(a){var b=this;a.preventDefault(),$(this).attr("disabled","disabled"),$("#search-requester").attr("disabled","disalbed"),currentUserPager.query=$("#search-requester").val(),currentUserPager.offset=0,$(this).parent().parent().parent().find("span.current-page").html("&emsp;Page 1&emsp;"),$(this).parent().parent().parent().find("span.previous-page").css("opacity","0.5"),loadItems(currentUserPager).then(function(){$(b).removeAttr("disabled"),$("#search-requester").removeAttr("disabled")})["catch"](function(){$(b).removeAttr("disabled"),$("#search-requester").removeAttr("disabled")})}),$("#search-requestee-click").click(function(a){var b=this;a.preventDefault(),$(this).attr("disabled","disabled"),$("#search-requestee").attr("disabled","disalbed"),partnerPager.query=$("#search-requestee").val(),partnerPager.offset=0,$("#search-requestee-click").parent().parent().parent().find("span.current-page").html("&emsp;Page 1&emsp;"),$(this).parent().parent().parent().find("span.previous-page").css("opacity","0.5"),loadItems(partnerPager).then(function(){$(b).removeAttr("disabled"),$("#search-requestee").removeAttr("disabled")})["catch"](function(){$(b).removeAttr("disabled"),$("#search-requestee").removeAttr("disabled")})}),$("#requester-items-pagination").find(".next-page").click(function(a){if(a.preventDefault(),"0.5"!==$(this).css("opacity")){$(this).css("opacity","0.5");var b=currentUserPager.offset/6;b++,$("#requester-items-pagination").find("span.current-page").html("&emsp;Page "+b+"&emsp;"),loadItems(currentUserPager)}}),$("#requester-items-pagination").find(".previous-page").click(function(a){if(a.preventDefault(),"0.5"!==$(this).css("opacity")){$(this).css("opacity","0.5"),currentUserPager.offset-=currentUserPager.areMoreAvailable?12:6;var b=currentUserPager.offset/6;b++,$("#requester-items-pagination").find("span.current-page").html("&emsp;Page "+b+"&emsp;"),loadItems(currentUserPager)}}),$("#requestee-items-pagination").find(".next-page").click(function(a){if(a.preventDefault(),"0.5"!==$(this).css("opacity")){$(this).css("opacity","0.5");var b=partnerPager.offset/6;b++,$("#requestee-items-pagination").find("span.current-page").html("&emsp;Page "+b+"&emsp;"),loadItems(partnerPager)}}),$("#requestee-items-pagination").find(".previous-page").click(function(a){if(a.preventDefault(),"0.5"!==$(this).css("opacity")){$(this).css("opacity","0.5"),partnerPager.offset-=partnerPager.areMoreAvailable?12:6;var b=partnerPager.offset/6;b++,$("#requestee-items-pagination").find("span.current-page").html("&emsp;Page "+b+"&emsp;"),loadItems(partnerPager)}}),$("#total-offer-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," 0")),$("#total-request-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," 0"));var setupOfferArea=function(){if(0!==CurrentOffer.length&&0!==CurrentRequest.length?$("#send-trade").removeAttr("disabled"):$("#send-trade").attr("disabled","disabled"),$("#offer-items").empty(),0===CurrentOffer.length)return $("#total-offer-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," 0")),void $("#offer-items").append("\n        \n        <div class=\"col-12\">\n            <p style=\"text-align:center;margin-top:2rem;opacity:0.5;font-weight:600;\">You have not offered any items yet.</p>\n        </div>\n        \n        ");var a=[],b=0,c=!0,d=!1,e=void 0;try{for(var f,g,h=CurrentOffer[Symbol.iterator]();!(c=(f=h.next()).done);c=!0){g=f.value,b+=g.averagePrice,a.push(g.catalogId);var i="<p style=\"font-size:0.65rem;font-weight:400;\">&emsp;</p>";g.serial&&(i="<p style=\"font-size:0.65rem;font-weight:400;\">Serial: ".concat(number_format(g.serial),"</p>")),$("#offer-items").append("\n        \n        <div class=\"col-12 remove-item-requester-items item-in-trade-request-or-offer-sidebar\" style=\"cursor:pointer;\" data-userinventoryid=\"".concat(g.userInventoryId,"\">\n            <div class=\"row\">\n                <div class=\"col-4\">\n                    <img src=\"").concat(window.subsitutionimageurl,"\" style=\"width:100%;height:auto;display:block;margin:0 auto;max-width:70px;\" data-catalogid=\"").concat(g.catalogId,"\" />\n                </div>\n                <div class=\"col-8\">\n                    <p style=\"font-size:0.85rem;margin-bottom:0;font-weight:600;\">").concat(xss(g.catalogName),"</p>\n                    <p style=\"font-size:0.65rem;margin-bottom:0;font-weight:400;\">").concat(formatCurrency(1,"0.65rem")+" "+xss(number_format(g.averagePrice)),"</p>\n                    ").concat(i,"\n                </div>\n            </div>\n            \n        </div>\n        "))}}catch(a){d=!0,e=a}finally{try{c||null==h["return"]||h["return"]()}finally{if(d)throw e}}$("#total-offer-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," ").concat(number_format(b))),setCatalogThumbs(a)};$(document).on("click",".trade-item-requester-items",function(a){a.preventDefault();var b=parseInt($(this).attr("data-userinventoryid"),10),c=parseInt($(this).attr("data-serial"),10),d=parseInt($(this).attr("data-averageprice"),10);isNaN(c)&&(c=void 0);var e=parseInt($(this).attr("data-catalogid")),f=$(this).attr("data-catalogname");return inOffer(b)||inRequest(b)?void 0:4<=CurrentOffer.length?void warning("You can only include up to four items, per user, in a trade."):void(CurrentOffer.push({userInventoryId:b,catalogId:e,catalogName:f,serial:c,averagePrice:d}),setupOfferArea(),$(this).attr("class","col-6 col-md-4 trade-card-hover remove-item-".concat(currentUserPager.div.slice(1)," item-in-trade-request-or-offer")))}),$(document).on("click",".remove-item-requester-items",function(a){a.preventDefault();var b=parseInt($(this).attr("data-userinventoryid"),10);if(inOffer(b)||inRequest(b)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h,i=CurrentOffer[Symbol.iterator]();!(d=(g=i.next()).done);d=!0)h=g.value,h.userInventoryId!==b&&c.push(h)}catch(a){e=!0,f=a}finally{try{d||null==i["return"]||i["return"]()}finally{if(e)throw f}}return CurrentOffer=c,$(".remove-item-requester-items.item-in-trade-request-or-offer[data-userinventoryid=\""+b+"\"]").attr("class","col-6 col-md-4 trade-card-hover trade-item-".concat(currentUserPager.div.slice(1))),$(".remove-item-requester-items.item-in-trade-request-or-offer-sidebar[data-userinventoryid=\""+b+"\"]").remove(),void setupOfferArea()}});var setupRequestArea=function(){if(0!==CurrentOffer.length&&0!==CurrentRequest.length?$("#send-trade").removeAttr("disabled"):$("#send-trade").attr("disabled","disabled"),$("#request-items").empty(),0===CurrentRequest.length)return $("#total-request-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," 0")),void $("#request-items").append("\n        \n        <div class=\"col-12\">\n            <p style=\"text-align:center;margin-top:2rem;opacity:0.5;font-weight:600;\">You have not requested any items yet.</p>\n        </div>\n        \n        ");var a=[],b=0,c=!0,d=!1,e=void 0;try{for(var f,g,h=CurrentRequest[Symbol.iterator]();!(c=(f=h.next()).done);c=!0){g=f.value,b+=g.averagePrice,a.push(g.catalogId);var i="<p style=\"font-size:0.65rem;font-weight:400;\">&emsp;</p>";g.serial&&(i="<p style=\"font-size:0.65rem;font-weight:400;\">Serial: ".concat(number_format(g.serial),"</p>")),$("#request-items").append("\n        \n        <div class=\"col-12 remove-item-requestee-items item-in-trade-request-or-offer-sidebar\" style=\"cursor:pointer;\" data-userinventoryid=\"".concat(g.userInventoryId,"\">\n            <div class=\"row\">\n                <div class=\"col-4\">\n                    <img src=\"").concat(window.subsitutionimageurl,"\" style=\"width:100%;height:auto;display:block;margin:0 auto;max-width:70px;\" data-catalogid=\"").concat(g.catalogId,"\" />\n                </div>\n                <div class=\"col-8\">\n                    <p style=\"font-size:0.85rem;margin-bottom:0;font-weight:600;\">").concat(xss(g.catalogName),"</p>\n                    <p style=\"font-size:0.65rem;margin-bottom:0;font-weight:400;\">").concat(formatCurrency(1,"0.65rem")+" "+xss(number_format(g.averagePrice)),"</p>\n                    ").concat(i,"\n                </div>\n            </div>\n            \n        </div>\n        "))}}catch(a){d=!0,e=a}finally{try{c||null==h["return"]||h["return"]()}finally{if(d)throw e}}$("#total-request-value").html("Total Value: ".concat(formatCurrency(1,"1rem")," ").concat(number_format(b))),setCatalogThumbs(a)};$(document).on("click",".trade-item-requestee-items",function(a){a.preventDefault();var b=parseInt($(this).attr("data-userinventoryid"),10),c=parseInt($(this).attr("data-serial"),10),d=parseInt($(this).attr("data-averageprice"),10);isNaN(c)&&(c=void 0);var e=parseInt($(this).attr("data-catalogid")),f=$(this).attr("data-catalogname");return inOffer(b)||inRequest(b)?void 0:4<=CurrentRequest.length?void warning("You can only include up to four items, per user, in a trade."):void(CurrentRequest.push({userInventoryId:b,catalogId:e,catalogName:f,serial:c,averagePrice:d}),setupRequestArea(),$(this).attr("class","col-6 col-md-4 trade-card-hover remove-item-".concat(partnerPager.div.slice(1)," item-in-trade-request-or-offer")))}),$(document).on("click",".remove-item-requestee-items",function(a){a.preventDefault();var b=parseInt($(this).attr("data-userinventoryid"),10);if(inOffer(b)||inRequest(b)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h,i=CurrentRequest[Symbol.iterator]();!(d=(g=i.next()).done);d=!0)h=g.value,h.userInventoryId!==b&&c.push(h)}catch(a){e=!0,f=a}finally{try{d||null==i["return"]||i["return"]()}finally{if(e)throw f}}return CurrentRequest=c,$(".remove-item-requestee-items.item-in-trade-request-or-offer[data-userinventoryid=\""+b+"\"]").attr("class","col-6 col-md-4 trade-card-hover trade-item-".concat(partnerPager.div.slice(1))),$(".remove-item-requestee-items.item-in-trade-request-or-offer-sidebar[data-userinventoryid=\""+b+"\"]").remove(),void setupRequestArea()}}),$(document).on("click","#send-trade",function(){questionYesNo("Are you sure you want to send this trade?",function(){loading();var a=[];CurrentOffer.forEach(function(b){return a.push(b.userInventoryId)});var b=[];CurrentRequest.forEach(function(a){return b.push(a.userInventoryId)}),request("/user/"+traderId+"/trade/request","PUT",{offerItems:a,requestedItems:b}).then(function(){success("Your trade has been sent. You can review its status in the trades page.",function(){window.location.reload()})})["catch"](function(a){if(a&&a.responseJSON&&a.responseJSON.message)warning(a.responseJSON.message);else{var b="UnknownException";a&&a.responseJSON&&a.responseJSON.error&&a.responseJSON.error.code&&(b=a.responseJSON.error.code),warning("An unknown error has occurred. Please try again. Code: "+b)}})})});