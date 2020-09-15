"use strict";var groupdata=$("#groupdata"),groupid=groupdata.attr("data-groupid"),isOwner=groupdata.attr("data-isowner");isOwner=!("true"!==isOwner);/**
 * @type {boolean}
 */var groupMemberApprovalRequired=groupdata.attr("data-approvalrequired");groupMemberApprovalRequired=!("1"!==groupMemberApprovalRequired);/**
 * @type {{maxRoles: number; rank: {min: number; max: number;}; roleName: {minLength: number; maxLength: number;} rolePermissions: {id: string; name: string}[];}}
 */var configMetaData={};request("/group/metadata/manage","GET").then(function(a){configMetaData=a,loadManagePage()});function loadManagePage(){function a(c){var d=1;return"-"===c[0]&&(d=-1,c=c.substr(1)),function(e,a){/* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */var b=e[c]<a[c]?-1:e[c]>a[c]?1:0;return b*d}}function b(a){var b=!1;"create"===a.type&&(b=!0);var c="",d="",e="",f="",g="",h=a.permissions;h||(h={}),0===h.getWall&&(c="selected=\"selected\""),0===h.postWall&&(d="selected=\"selected\""),0===h.getShout&&(e="selected=\"selected\""),0===h.postShout&&(f="selected=\"selected\""),0===h.manage&&(g="selected=\"selected\"");var i="";b||(i="<button type=\"button\" class=\"btn btn-small btn-danger\" id=\"deleteRoleset\" data-id="+a.roleSetId+">Delete</button>"),$("#groupRolesOptionsDisplay").empty(),$("#groupRolesOptionsDisplay").html("\n<div class=\"col-6\">\n                                                    <small class=\"form-text text-muted\">Role Name</small>\n                                                    <input type=\"text\" class=\"form-control\" id=\"newRoleName\" placeholder=\"\" value=\""+a.name.escape()+"\">\n                                                </div>\n                                                <div class=\"col-6\">\n                                                    <small class=\"form-text text-muted\">Rank Value (between 1-254)</small>\n                                                    <input type=\"text\" class=\"form-control\" id=\"newRoleValue\" placeholder=\"\" value=\""+a.rank+"\">\n                                                </div>\n                                                <div class=\"col-12\">\n                                                    <small class=\"form-text text-muted\">Role Description</small>\n                                                    <input type=\"text\" class=\"form-control\" id=\"newRoleDescription\" placeholder=\"\" value=\""+a.description.escape()+"\">\n                                                </div>\n                                                <div class=\"col-6 col-md-4\">\n                                                    <small class=\"form-text text-muted\">View Group Wall</small>\n                                                    <select class=\"form-control\" id=\"getGroupWall\">\n                                                        <option value=\"1\">Yes</option>\n                                                        <option value=\"0\" "+c+">No</option>\n                                                    </select>\n                                                </div>\n                                                <div class=\"col-6 col-md-4\">\n                                                    <small class=\"form-text text-muted\">Post to Group Wall</small>\n                                                    <select class=\"form-control\" id=\"postGroupWall\">\n                                                        <option value=\"1\">Yes</option>\n                                                        <option value=\"0\" "+d+">No</option>\n                                                    </select>\n                                                </div>\n                                                <div class=\"col-6 col-md-4\">\n                                                    <small class=\"form-text text-muted\">View Shout</small>\n                                                    <select class=\"form-control\" id=\"getShout\">\n                                                        <option value=\"1\">Yes</option>\n                                                        <option value=\"0\" "+e+">No</option>\n                                                    </select>\n                                                </div>\n                                                <div class=\"col-6 col-md-4\">\n                                                    <small class=\"form-text text-muted\">Update Shout</small>\n                                                    <select class=\"form-control\" id=\"postShout\">\n                                                        <option value=\"1\">Yes</option>\n                                                        <option value=\"0\" "+f+">No</option>\n                                                    </select>\n                                                </div>\n                                                <div class=\"col-6 col-md-4\">\n                                                    <small class=\"form-text text-muted\">Manage Group</small>\n                                                    <select class=\"form-control\" id=\"manageGroup\">\n                                                        <option value=\"1\">Yes</option>\n                                                        <option value=\"0\" "+g+">No</option>\n                                                    </select>\n                                                </div>\n                                                <div class=\"col-6 col-md-4\" style=\"margin-top:1rem;\">\n                                                    \n                                                    <button type=\"button\" class=\"btn btn-small btn-success\" id=\"updateRoleset\" data-create=\""+b+"\" data-id="+a.roleSetId+">Submit</button>\n\n                                                    ".concat(i,"\n                                                </div>\n"))}// Setup Member Update
function c(a){window.curId=a,$("#noMembersDisplay").hide(),$("#hasMembersDisplay").hide(),request("/group/"+groupid+"/members/"+a+"?sort=desc&offset="+window.membersOffset+"&limit=12","GET").then(function(a){0===a.total?$("#noMembersDisplay").show():$("#hasMembersDisplay").show(),$("#hasMembersDisplay").empty();var b=[];a.members.forEach(function(a){var c="";window.roles.forEach(function(b){0!==b.rank&&(b.roleSetId===a.roleSetId?c+="<option selected=\"selected\" value="+b.roleSetId+">"+b.name.escape()+"</option>":c+="<option value="+b.roleSetId+">"+b.name.escape()+"</option>")});var d="";isOwner&&(d="<p style=\"font-size: 0.75rem;color:red;cursor:pointer;\" data-userid-to-kick=\""+a.userId+"\" class=\"kick-user\">Kick</p>"),$("#hasMembersDisplay").append("<div class=\"col-4 col-md-3 col-lg-2\">"+d+"<a href=\"/users/"+a.userId+"/profile\"><img data-userid=\""+a.userId+"\" style=\"width:100%;\" /><p class=\"text-center text-truncate\" data-userid=\""+a.userId+"\"></p></a><select data-userid=\""+a.userId+"\" class=\"form-control rankUser\">"+c+"</select></div>"),b.push(a.userId)}),setUserThumbs(b),setUserNames(b),0===window.membersOffset?$("#loadLessMembers").hide():$("#loadLessMembers").show(),12<=a.total-window.membersOffset?$("#loadMoreMembers").show():$("#loadMoreMembers").hide()})["catch"](function(){window.membersOffset=0,$("#noMembersDisplay").show()})}window.membersOffset=0,window.history.replaceState(null,null,"/groups/"+groupid+"/"+groupdata.attr("data-encoded-name")+"/manage"),request("/group/"+groupid+"/shout","GET").then(function(a){$("#newShoutValue").attr("placeholder",a.shout.escape())})["catch"](function(){}),$(document).on("click","#updateShoutClick",function(){var a=$("#newShoutValue").val();request("/group/"+groupid+"/shout","PATCH",JSON.stringify({shout:a})).then(function(){success("Your group shout has been posted.")})["catch"](function(a){warning(a.responseJSON.message)})}),$(document).on("click","#updateIconClick",function(){function a(c){$.ajax({type:"PATCH",enctype:"multipart/form-data",url:"/api/v1/group/"+groupid+"/icon",headers:{"x-csrf-token":c},data:b,processData:!1,contentType:!1,cache:!1,timeout:6e5,success:function(a){function b(){return a.apply(this,arguments)}return b.toString=function(){return a.toString()},b}(function(){success("The group's icon has been updated.")}),error:function error(b){if(403===b.status){console.log(b);var c=b.getResponseHeader("x-csrf-token");if("undefined"!=typeof c)return a(c);console.log("bad")}else b.responseJSON&&b.responseJSON.message?warning(b.responseJSON.message):warning("An unknown error has occured. Try reloading the page, and trying again.")}})}var b=new FormData;if("undefined"!=typeof $("#textureFile")[0].files[0])b.append("png",$("#textureFile")[0].files[0]);else return void warning("A Group Logo is required. Please select one, and try again");a("")}),$(document).on("click","#transferOwnerClick",function(){var a=$("#newOwnerValue").val();request("/user/username?username="+a,"GET").then(function(a){request("/user/"+a.userId+"/groups/"+groupid+"/role","GET").then(function(b){return 0===b.rank?warning("This user doesn't seem to be in this group"):void// Ready
questionYesNo("Are you sure you'd like to transfer group ownership to "+a.username.escape()+"?",function(){request("/group/"+groupid+"/transfer","PATCH",JSON.stringify({userId:a.userId})).then(function(){success("Group ownership has been transferred.",function(){window.location.reload()})})["catch"](function(a){warning(a.responseJSON.message)})})})["catch"](function(){warning("This user doesn't seem to be in this group")})})["catch"](function(){warning("This user doesn't seem to exist!")})}),$(document).on("click","#spendGroupFunds",function(){var a=$("#payoutUsername").val(),b=parseInt($("#amountOfFunds").val());if(!b)return warning("Please enter a valid amount.");var c=parseInt($("#currencyType").val());request("/user/username?username="+a,"GET").then(function(a){request("/user/"+a.userId+"/groups/"+groupid+"/role","GET").then(function(d){return 0===d.rank?warning("This user doesn't seem to be in this group"):void// Ready
questionYesNoHtml("Are you sure you'd like to payout "+formatCurrency(c)+" "+b+" to "+a.username.escape()+"?",function(){request("/group/"+groupid+"/payout","PUT",JSON.stringify({userId:a.userId,amount:b,currency:c})).then(function(){success("This user has been paid out.",function(){window.location.reload()})})["catch"](function(a){warning(a.responseJSON.message)})})})["catch"](function(){warning("This user doesn't seem to be in this group")})})["catch"](function(){warning("This user doesn't seem to exist!")})}),$(document).on("click","#updateGroupDescription",function(){var a=$("#groupDescriptionText").val();request("/group/"+groupid+"/description","PATCH",JSON.stringify({description:a})).then(function(){success("Your group description has been updated.")})["catch"](function(a){warning(a.responseJSON.message)})}),request("/group/"+groupid+"/roles","GET").then(function(a){var d=!1;window.roles=a;var e=!0;a.forEach(function(a){0!==a.rank&&($("#groupRolesSelection").append("<option value="+a.roleSetId+">"+a.name.escape()+"</option>"),!d&&(c(a.roleSetId),d=!0),e?($("#roleset-selection").prepend("\n                    \n                        <div class=\"col-12\">\n                            <p data-id=\"".concat(a.roleSetId,"\">").concat(xss(a.name),"</p>\n                        </div>\n                        \n                        ")),e=!1,b(a)):$("#roleset-selection").prepend("\n                    \n                        <div class=\"col-12\">\n                            <p style=\"opacity: 0.5;\" data-id=\"".concat(a.roleSetId,"\">").concat(xss(a.name),"</p>\n                        </div>\n                        \n                        ")))}),a.length<configMetaData.maxRoles&&$("#create-role").prepend("<div class=\"col-12\">\n                <button id=\"create-new-role\" style=\"margin-top:1rem;font-size:0.75rem;\" class=\"btn btn-outline-success\">Create New Role</button>\n            </div>")})["catch"](function(a){console.log(a),$("#noMembersDisplay").show()}),$(document).on("click","#updateRoleset",function(){var c=parseInt($(this).attr("data-id"),10),e={name:$("#newRoleName").val(),rank:parseInt($("#newRoleValue").val()),description:$("#newRoleDescription").val(),permissions:{getWall:parseInt($("#getGroupWall").val()),postWall:parseInt($("#postGroupWall").val()),getShout:parseInt($("#getShout").val()),postShout:parseInt($("#postShout").val()),manage:parseInt($("#manageGroup").val())}},f=$(this).attr("data-create");"false"===f?request("/group/"+groupid+"/role/"+c,"PATCH",e).then(function(){toast(!0,"This role has been updated."),$("#roleset-selection").empty(),e.roleSetId=c,window.roles.forEach(function(a){a.roleSetId===e.roleSetId&&255===a.rank&&(e.rank=255,e.permissions.getShout=1,e.permissions.getWall=1,e.permissions.postWall=1,e.permissions.postShout=1,e.permissions.manage=1)});var d=[];window.roles.forEach(function(a){a.roleSetId!==c&&d.push(a)}),d.push(e),window.roles=d.sort(a("-rank")),window.roles.forEach(function(a){0===a.rank||(a.roleSetId===e.roleSetId?$("#roleset-selection").append("\n                    \n                    <div class=\"col-12\">\n                        <p data-id=\"".concat(a.roleSetId,"\">").concat(xss(a.name),"</p>\n                    </div>\n                    \n                    ")):$("#roleset-selection").append("\n                    \n                    <div class=\"col-12\">\n                        <p data-id=\"".concat(a.roleSetId,"\" style=\"opacity:0.5;\">").concat(xss(a.name),"</p>\n                    </div>\n                    \n                    ")))}),b(e)})["catch"](function(a){console.log(a),toast(!1,a.responseJSON.message)}):request("/group/"+groupid+"/role","PUT",e).then(function(c){toast(!0,"Role created!"),$("#roleset-selection").empty(),e.roleSetId=c.roleSetId,window.roles.push(e),window.roles=window.roles.sort(a("-rank")),window.roles.forEach(function(a){0===a.rank||(a.roleSetId===e.roleSetId?$("#roleset-selection").append("\n                    \n                    <div class=\"col-12\">\n                        <p data-id=\"".concat(a.roleSetId,"\">").concat(xss(a.name),"</p>\n                    </div>\n                    \n                    ")):$("#roleset-selection").append("\n                    \n                    <div class=\"col-12\">\n                        <p data-id=\"".concat(a.roleSetId,"\" style=\"opacity:0.5;\">").concat(xss(a.name),"</p>\n                    </div>\n                    \n                    ")))}),b(e)})["catch"](function(a){console.log(a),toast(!1,a.responseJSON.message)})}),$(document).on("click","#create-new-role",function(){$("#roleset-selection p").each(function(){$(this).css("opacity","0.5")}),b({type:"create",name:"New Role",description:"New Role",rank:1})}),$(document).on("click","#roleset-selection p",function(){var a=parseInt($(this).attr("data-id"));$("#roleset-selection p").each(function(){$(this).css("opacity","0.5")}),$(this).css("opacity","1"),window.roles.forEach(function(c){c.roleSetId===a&&b(c)})}),$("#groupRolesSelection").change(function(){window.membersOffset=0;var a=parseInt($(this).val());c(a),$("#hasMembersDisplay").empty()}),$(document).on("change",".rankUser",function(){var a=parseInt($(this).val()),b=$(this);request("/group/"+groupid+"/member/"+$(this).attr("data-userid"),"PATCH",JSON.stringify({role:a})).then(function(){toast(!0,"This user has been ranked."),b.parent().remove()})["catch"](function(a){toast(!1,a.responseJSON.message)})}),$(document).on("click",".kick-user",function(a){a.preventDefault();var b=$(this).attr("data-userid-to-kick");questionYesNo("Are you sure you'd like to kick this user?",function(){loading(),request("/group/"+groupid+"/member/"+b,"DELETE",{}).then(function(){c(window.curId),toast(!0,"User has been kicked.")})["catch"](function(a){warning(a.responseJSON.message)})})}),$(document).on("click","#updateGroupApprovalRequiredStatus",function(a){a.preventDefault(),loading(),request("/group/"+groupid+"/approval-required","PATCH",{approvalStatus:parseInt($("#groupApprovalRequired").val(),10)}).then(function(){success("Member approval status has been updated for this group.",function(){window.location.reload()})})["catch"](function(a){warning(a.responseJSON.message)})}),$(document).on("click","#loadMoreMembers",function(){window.membersOffset+=12,c(window.curId)}),$(document).on("click","#loadLessMembers",function(){window.membersOffset-=12,c(window.curId)});var e=!1,f=0,g=function(){e||(e=!0,request("/economy/group/"+groupid+"/transactions?offset="+f.toString(),"GET").then(function(a){if(e=!1,0===a.length)return $("#group-transactions").empty().append("<p>This group has not had any transactions.</p>");$("#group-transactions").append("\n        <table class=\"table\">\n            <thead>\n                <tr>\n                <th scope=\"col\">#</th>\n                <th scope=\"col\">Amount</th>\n                <th scope=\"col\">Description</th>\n                <th scope=\"col\">Date</th>\n                </tr>\n            </thead>\n            <tbody>\n            \n            </tbody>\n        </table>");var b=!0,c=!1,d=void 0;try{for(var g,h=a[Symbol.iterator]();!(b=(g=h.next()).done);b=!0){var i=g.value,j=formatCurrency(i.currency),k=i.description;0!==i.catalogId&&(k+=" <a href=\"/catalog/"+i.catalogId+"\">[link]</a>"),$("#group-transactions").find("tbody").append("<tr> <th scope=\"row\">"+i.transactionId+"</th><td>"+j+i.amount+"</td><td>"+k+"</td><td>"+moment(i.date).local().format("MMMM Do YYYY, h:mm a")+"</td></tr><tr>")}}catch(a){c=!0,d=a}finally{try{b||null==h["return"]||h["return"]()}finally{if(c)throw d}}25<=a.length?(f+=25,$(".loadMoreTransactionsClick").css("display","block")):$(".loadMoreTransactionsClick").hide()})["catch"](function(){}))};if(g(),$(document).on("click",".loadMoreTransactionsClick",function(a){a.preventDefault(),g(f)}),groupMemberApprovalRequired){var h=function(){j||($("#hasMembersPendingDisplay").empty(),j=!0,request("/group/"+groupid+"/join-requests?limit=12&offset="+i).then(function(a){if(0===i&&0===a.length)return $("#noMembersPendingDisplay").show();$("#hasMembersPendingDisplay").show();var b=[],c=!0,d=!1,e=void 0;try{for(var f,g,h=a[Symbol.iterator]();!(c=(f=h.next()).done);c=!0)g=f.value,b.push(g.userId),$("#hasMembersPendingDisplay").append("\n                <div class=\"col-4 col-md-3 col-lg-2\">\n                <a href=\"/users/".concat(g.userId,"/profile\"><img data-userid=\"").concat(g.userId,"\" style=\"width:100%;\" />\n                    <p class=\"text-center text-truncate\" data-userid=\"").concat(g.userId,"\"></p>\n                </a>\n                \n                    <button type=\"button\" class=\"btn btn-success approveMemberJoinRequest\" data-usertoapprove=\"").concat(g.userId,"\" style=\"margin:0auto;display:block;width: 100%;\">Approve</button>\n                    <button type=\"button\" class=\"btn btn-danger declineMemberJoinRequest\" data-usertodecline=\"").concat(g.userId,"\" style=\"margin:0auto;display:block;width: 100%;\">Decline</button>\n                \n                </div>\n                \n                \n                "))}catch(a){d=!0,e=a}finally{try{c||null==h["return"]||h["return"]()}finally{if(d)throw e}}setUserNames(b),setUserThumbs(b)})["catch"](function(a){warning(a.responseJSON.message)})["finally"](function(){j=!1}))},i=0,j=!1;h(),$(document).on("click",".approveMemberJoinRequest",function(a){a.preventDefault(),loading(),request("/group/"+groupid+"/join-request","POST",{userId:parseInt($(this).attr("data-usertoapprove"),10)}).then(function(){toast(!0,"Member approved."),h()})["catch"](function(a){warning(a.responseJSON.message),h()})})}$(document).on("click",".group-settings-option",function(a){a.preventDefault(),$(".group-settings-option").css("opacity","0.5"),$(this).css("opacity","1"),$(".group-settings-panel").hide(),$("."+$(this).attr("data-class-to-toggle")).show()}),$(document).on("click","#deleteRoleset",function(c){c.preventDefault();var d=parseInt($(this).attr("data-id"),10);questionYesNo("Are you sure you'd like to delete this role?",function(){loading(),request("/group/"+groupid+"/roleset/"+d,"DELETE").then(function(){toast(!0,"Role deleted."),$("#roleset-selection").empty();// simple ui bugs that need to be fixed...
var c=[];window.roles.forEach(function(a){a.roleSetId!==d&&c.push(a)}),window.roles=c.sort(a("-rank")),window.roles.forEach(function(a){0===a.rank||$("#roleset-selection").append("\n                    \n                    <div class=\"col-12\">\n                        <p data-id=\"".concat(a.roleSetId,"\" style=\"opacity:0.5;\">").concat(xss(a.name),"</p>\n                    </div>\n                    \n                    "))}),b({type:"create",name:"New Role",description:"New Role",rank:1})})["catch"](function(a){console.error(a),warning(a.responseJSON.message)})})}),request("/group/"+groupid+"/ownership-changes?limit=25","GET").then(function(a){if(console.log(a),0===a.length)$("#group-ownership-changes").append("\n        \n        <div class=\"col-12\">\n            <p>This group has not had any ownership changes.</p>\n        </div>\n\n        ");else{$("#group-ownership-changes").append("\n            <div class=\"col-12\">\n                <table class=\"table\" style=\"margin-bottom:0;\">\n                    <thead>\n                        <tr>\n                        <th scope=\"col\" style=\"border-top: none;\">Description</th>\n                        <th scope=\"col\" style=\"border-top: none;\">Date</th>\n                        </tr>\n                    </thead>\n                    <tbody id=\"groupOwnershipChangesTbody\">\n                    \n                    </tbody>\n                </table>\n            </div>\n        ");var b=$("#groupOwnershipChangesTbody"),c=[],d=!0,e=!1,f=void 0;try{for(var g,h,i=a[Symbol.iterator]();!(d=(g=i.next()).done);d=!0){h=g.value,c.push(h.actorUserId),c.push(h.userId);var j=h.type;1===j?b.append("\n            \n                <tr>\n                    <td><span data-userid=\"".concat(h.actorUserId,"\"></span> abandoned the group, leaving nobody as the owner.</td>\n                    <td>").concat(moment(h.createdAt).fromNow(),"</td>\n                </tr>\n                \n                ")):2===j?b.append("\n            \n                <tr>\n                    <td><span data-userid=\"".concat(h.actorUserId,"\"></span> claimed ownership of the group.</td>\n                    <td>").concat(moment(h.createdAt).fromNow(),"</td>\n                </tr>\n                \n                ")):3===j&&b.append("\n            \n                <tr>\n                    <td><span data-userid=\"".concat(h.actorUserId,"\"></span> transferred group ownership to <span data-userid=\"").concat(h.userId,"\"></span>.</td>\n                    <td>").concat(moment(h.createdAt).fromNow(),"</td>\n                </tr>\n                \n                "))}}catch(a){e=!0,f=a}finally{try{d||null==i["return"]||i["return"]()}finally{if(e)throw f}}setUserNames(c)}})}




























