"use strict";$(document).on("click","#createThread",function(){var a=$("#threadTitle").val();if(64<a.length||3>a.length)return void warning("Your title must be at least 3 characters, and at most 64 characters.");var b=$("#threadBody").val(),c=parseInt($("#threadSubCategory").val()),d=parseInt($("#threadLocked").val()),e=parseInt($("#threadPinned").val());(isNaN(d)||isNaN(e))&&(d=0,e=0),request("/forum/thread/create","PUT",JSON.stringify({title:a,body:b,subCategoryId:c,locked:d,pinned:e})).then(function(a){console.log(a),window.location.href="/forum/thread/"+a.threadId+"?page=1"})["catch"](function(a){console.log(a),warning(a.responseJSON.message)})});



