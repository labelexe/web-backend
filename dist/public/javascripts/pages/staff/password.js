"use strict";$(document).on("click","#changePassword",function(){var a=$("#userId").val();request("/staff/user/"+a+"/resetpassword","POST").then(function(b){success("Link: https://hindigamer.club/reset/password?userId="+a+"&code="+b.code,function(){window.location.href="/staff"})})["catch"](function(a){warning(a.responseJSON.message)})});






