"use strict";$(document).on("click","#submit",function(){var a=$("#email").val(),b=grecaptcha.getResponse();loading(),request("/auth/request/password-reset","PUT",JSON.stringify({email:a,captcha:b})).then(function(){success("If your email was valid and attached to an account, a password reset email has been sent to you.",function(){window.location.href="/login"})})["catch"](function(a){console.error(a),warning(a.responseJSON.message)})});




