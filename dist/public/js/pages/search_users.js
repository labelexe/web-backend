"use strict";window.searchOffset=0,window.sortBy="id",window.sort="asc";var q="",url=new URL(window.location.href);url.searchParams.get("sortBy")&&(window.sortBy=url.searchParams.get("sortBy")),url.searchParams.get("sort")&&(window.sort=url.searchParams.get("sort")),url.searchParams.get("q")&&(q=url.searchParams.get("q")),"id"==window.sortBy&&"asc"==window.sort&&$("#newSortOrder option[value=1]").attr("selected","selected"),"id"==window.sortBy&&"desc"==window.sort&&$("#newSortOrder option[value=2]").attr("selected","selected"),"user_lastonline"==window.sortBy&&"desc"==window.sort&&$("#newSortOrder option[value=3]").attr("selected","selected"),search(0),$("#newSortOrder").on("change",function(){window.searchOffset=0;var a=parseInt($(this).val());window.sort=a,1==a?(window.sortBy="id",window.sort="asc"):2==a?(window.sortBy="id",window.sort="desc"):3==a&&(window.sortBy="user_lastonline",window.sort="desc"),$("#userSearchResultsDiv").empty(),search(0)});function search(a){/*
    $('#userSearchResultsDiv').children().each(function(k) {
        $(this).css("opacity", 0.5)
    })
    */request("/user/search?limit=25&username="+q+"&offset="+a+"&sort="+window.sort+"&sortBy="+window.sortBy).then(function(a){// $('#userSearchResultsDiv').empty();
var b=[];a.forEach(function(a){a.status=null===a.status?"\"\"":"\""+a.status+"\"",a.staff=1<=a.staff?"<p style=\"margin-bottom: 0;color:red;opacity: 0.75;\"><i class=\"fas fa-user-shield\" data-toggle=\"staffTooltip\" data-placement=\"top\" title=\"This user is an administrator.\"></i></p>":"",$("#userSearchResultsDiv").append("\n            <div class=\"col-12\">\n                <div class=\"card\" style=\"border-radius: 0;\">\n                    <div class=\"card-body groupChangeBgOnHover\" style=\"border-bottom-radius:0;border-radius: 0;\">\n                        <div class=\"row\">\n                            <div class=\"col-3 col-md-2 col-lg-1\" style=\"padding-right:0.25rem;\">\n                                <a href=\"/users/"+a.userId+"/profile\">\n                                    <img src=\"\" data-userid=\""+a.userId+"\" style=\"width: 100%;margin: 0 auto;max-width: 150px; display: block;\" />\n                                    "+a.staff+"\n                                </a>\n                            </div>\n                            <div class=\"col-7 col-md-8 col-lg-11\">\n                                <h5 style=\"margin-bottom:0;\"><a href=\"/users/"+a.userId+"/profile\">"+a.username+"</a></h5>\n                                <p style=\"font-size:0.75rem;margin-bottom:0.25rem;\">Last Online: "+moment(a.lastOnline).local().fromNow()+"</p>\n                                <p style=\"font-size:0.85rem;\">"+xss(a.status)+"</p>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>"),b.push(a.userId),$("[data-toggle=\"staffTooltip\"]").tooltip()}),25<=a.length?(window.searchOffset+=25,$(".loadMorePlayer").show()):(window.searchOffset=0,$(".loadMorePlayer").hide()),0>=a.length&&$("#userSearchResultsDiv").append("<div class=\"col-12\"><h3 class=\"text-center\" style=\"margin-top:1rem;\">Your search query returned 0 results.</h3></div>"),setUserThumbs(b),window.history.replaceState(null,null,"/users?sort="+window.sort+"&sortBy="+window.sortBy+"&q="+q)})["catch"](function(a){console.log(a)})}$(document).on("click","#searchForUserClick",function(){q=$("#searchForUserInput").val(),window.searchOffset=0,search(0)}),$(document).on("click",".loadMorePlayer",function(){q=$("#searchForUserInput").val(),search(window.searchOffset)});
































