"use strict";$(document).on("click","#leave-impersonate",function(a){a.preventDefault(),request("/staff/user/session-impersonation","DELETE",{}).then(function(){window.location.reload()})["catch"](function(a){console.error(a)})}),$(document).on("click","#impersonate-user",function(a){a.preventDefault(),request("/staff/user/session-impersonation","PUT",{userId:parseInt($(this).attr("data-userId"),10)}).then(function(){window.location.reload()})["catch"](function(a){console.error(a)})});






