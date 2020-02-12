var profileData = $('#profiledata');
var userid = profileData.attr("data-userid");
loadInventory();

function loadInventory() {
    request("/user/"+userid+"/groups")
    .then(function(d) {
        $('#groupCountDiv').html('('+d.total+')');
        if (d["groups"].length <= 0) {
            if (offset === 0) {
                $('#UserGroupsDiv').html('<h5>This user is not a member of any groups.</h5>');
            }
        }else{
            var catalogIdsRequest = [];
            $.each(d["groups"], function(index, value) {
                $('#UserGroupsDiv').append('<div class=" col-6 col-md-4 col-lg-3 col-xl-2" style="padding-bottom: 1rem;"><div class="card"><img style="width:100%;" data-catalogid='+value.groupIconCatalogId+' /><div class="card-body" style="padding:0.25rem;"><div class="row" style="max-width: 100%;overflow: hidden;padding: 0;margin: 0;"></div><div class="card-title text-left" style="margin-bottom:0;"><a style="color:#212529;" href="/groups/'+value.groupId+'/"><h5 class="text-left text-truncate">'+value.groupName.escape()+'</h5></a><p class="text-left text-truncate">Members: '+value.groupMemberCount+'</p><p class="text-left text-truncate">Rank: '+value.userRolesetName.escape()+'</p></div></div></div>');
                
                catalogIdsRequest.push(value.groupIconCatalogId);
            });
            setCatalogThumbs(catalogIdsRequest);
        }
    })
    .catch(function(e) {
        $('#UserGroupsDiv').html('<div class="col sm-12"><h5 class="text-center">This user is not a member of any groups.</h5></div>');
    });
}