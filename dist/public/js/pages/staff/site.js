"use strict";$(document).on("click","#updateSite",function(){var a=parseInt($("#siteEnabled").val());request("/staff/site","PATCH",JSON.stringify({siteDisabled:a})).then(function(){1===a?success("The site has been disabled. All pages, with the exception of this one, will be inaccessible until the site is enabled again."):success("The site has been enabled.")})["catch"](function(a){console.log(a),warning(a.responseJSON.message)})});




