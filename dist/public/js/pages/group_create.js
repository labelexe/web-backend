"use strict";request("/group/metadata/creation-fee","GET").then(function(a){$("#group-cost").html("".concat(formatCurrency(1,"1rem")," ")+number_format(a.cost))}),$(document).on("click","#createGroupClick",function(){$(this).attr("disabled","disabled");//var form = $('#assetsForm')[0];
//var data = new FormData(form);
var a=new FormData;if("undefined"!=typeof $("#textureFile")[0].files[0])a.append("png",$("#textureFile")[0].files[0]);else return warning("A Group Logo is required. Please select one, and try again"),void $(this).removeAttr("disabled");return"undefined"==typeof $("#groupName").val()||null===$("#groupName").val()||""===$("#groupName").val()?(warning("Please enter a name, then try again."),void $(this).removeAttr("disabled")):void(a.append("name",$("#groupName").val()),a.append("description",$("#groupDescription").val()),makeAsset(a,"fetch"))});function makeAsset(a,b){$.ajax({type:"POST",enctype:"multipart/form-data",url:"/api/v1/group/create",headers:{"x-csrf-token":b},data:a,processData:!1,contentType:!1,cache:!1,timeout:6e5,success:function success(a){a.id?window.location.href="/groups/"+a.id+"/":$(this).removeAttr("disabled")},error:function error(b){if(403===b.status){console.log(b);var c=b.getResponseHeader("x-csrf-token");if(console.log(c),"undefined"!=typeof c)return makeAsset(a,c);console.log("bad")}else $(this).removeAttr("disabled"),b.responseJSON&&b.responseJSON.message?warning(b.responseJSON.message):warning("An unknown error has occured. Try reloading the page, and trying again.")}})}


































