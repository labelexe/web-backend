var userData = $('#userdata');
var userid = userData.attr("data-userid");
var traderData = $('#tradedata')
var traderId = traderData.attr("data-userid");

/**
 * @type {{userInventoryId: number; catalogId: number; catalogName: string; serial: number|undefined}[]}
 */
let CurrentOffer = [];
const inOffer = (userInventoryId) => {
    for (const item of CurrentOffer) {
        if (item.userInventoryId === userInventoryId) {
            return true;
        }
    }
    return false;
}
/**
 * @type {{userInventoryId: number; catalogId: number; catalogName: string; serial: number|undefined}[]}
 */
let CurrentRequest = [];
const inRequest = (userInventoryId) => {
    for (const item of CurrentRequest) {
        if (item.userInventoryId === userInventoryId) {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param {{isLoading: boolean; userId: number|string; offset: number; query?: string; div: string; areMoreAvailable: boolean;}} data 
 */
const loadItems = (data) => {
    if (data.isLoading) {
        return;
    }
    data.isLoading = true;
    let oldHeight = $(data.div).innerHeight();
    let paddTop = Math.round((oldHeight / 2)-16)+'px';
    let paddBottom =  Math.round((oldHeight / 2)-16)+'px';
    $(data.div).empty()
    $(data.div).append(`
    
    <div class="col-12" style="margin-top:${paddTop};margin-bottom:${paddBottom};">
        <div class="spinner-border" role="status" style="margin:0 auto;display: block;">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    
    `);
    // this is to prevent searching up "undefined" literally (or empty strings)
    let _q = '';
    if (data.query) {
        _q = data.query;
    }
    return request('/user/'+data.userId+'/inventory/collectibles?limit=6&offset='+data.offset+'&query='+_q, 'GET').then(items => {
        console.log('.then');
        $(data.div).empty()
        data.isLoading = false;
        if (items.items.length === 0) {
            $(data.div).parent().find('span.next-page').css('opacity','0.5');
            $(data.div).append(`
            
            <div class="col-12" style="margin-top:8rem;margin-bottom:8rem;">
                <p style="text-align:center;">Oops, it looks like there aren't any items to show.</p>
            </div>
            
            `);
            data.areMoreAvailable = false;
            return;
        }
        let setThumbs = [];
        for (const item of items.items) {
            setThumbs.push(item.catalogId);
            let serial = '';
            if (item.serial) {
                serial = `<p style="font-size:0.65rem;margin-bottom:-1rem;margin-left:0.15rem;z-index:2;" class="text-truncate">Serial: ${number_format(item.serial)}</p>`;
            }
            let customClass = `trade-item-${data.div.slice(1)}`;
            if (inOffer(item.userInventoryId) || inRequest(item.userInventoryId)) {
                customClass = `remove-item-${data.div.slice(1)} item-in-trade-request-or-offer`
            }
            $(data.div).append(`
            
            <div class="col-6 col-md-4 trade-card-hover ${customClass}" style="margin-bottom:1rem;" 
            data-userinventoryid="${item.userInventoryId}" 
            data-serial="${item.serial}"
            data-catalogname="${xss(item.catalogName)}"
            data-catalogid="${item.catalogId}"
            data-averageprice="${item.averagePrice}"
            >
                <div class="card">
                    ${serial}
                    <img src="${window.subsitutionimageurl}" style="width:100%;height:auto;margin:0 auto;display:block;max-width:100px;" data-catalogid="${item.catalogId}" />
                    <p style="font-size:0.85rem;font-weight:500;" class="text-truncate">${xss(item.catalogName)}</p>
                    <p style="font-size:0.65rem;" class="text-truncate">${formatCurrency(1, '0.65rem')} ${number_format(item.averagePrice)}</p>
                </div>
            </div>
            
            `);
        }
        setCatalogThumbs(setThumbs);
        // if current offset is 0, hide previous page button
        if (data.offset === 0) {
            $(data.div+'-pagination').find('.previous-page').css('opacity','0.5');
        }else{
            // otherwise show previous page button
            $(data.div+'-pagination').find('.previous-page').css('opacity','1');
        }
        // if more items are available, show next page button
        if (items.areMoreAvailable) {
            data.areMoreAvailable = true;
            data.offset = data.offset + 6;
            $(data.div+'-pagination').find('.next-page').css('opacity','1');
        }else{
            data.areMoreAvailable = false;
            // otherwise dont show next page button
            $(data.div+'-pagination').find('.next-page').css('opacity','0.5');
        }
        console.log(items);
    })
    .catch(e => {
        console.error(e);
        data.isLoading = false;
    })
}

const currentUserPager = {
    isLoading: false,
    userId: userid,
    offset: 0,
    query: undefined,
    div: '#requester-items',
    areMoreAvailable: true,
}
loadItems(currentUserPager);

const partnerPager = {
    isLoading: false,
    userId: traderId,
    offset: 0,
    query: undefined,
    div: '#requestee-items',
    areMoreAvailable: true,
}
loadItems(partnerPager);

// setup search function for requester
$('#search-requester-click').click(function(e) {
    e.preventDefault();
    $(this).attr('disabled','disabled');
    $('#search-requester').attr('disabled','disalbed');
    currentUserPager.query = $('#search-requester').val();
    currentUserPager.offset = 0;
    $(this).parent().parent().parent().find('span.current-page').html('&emsp;Page '+1+'&emsp;');
    $(this).parent().parent().parent().find('span.previous-page').css('opacity','0.5');

    loadItems(currentUserPager)
    .then(d => {
        $(this).removeAttr('disabled');
        $('#search-requester').removeAttr('disabled');
    })
    .catch(() => {
        $(this).removeAttr('disabled');
        $('#search-requester').removeAttr('disabled');
    })
});
// setup search function for requestee
$('#search-requestee-click').click(function(e) {
    e.preventDefault();
    $(this).attr('disabled','disabled');
    $('#search-requestee').attr('disabled','disalbed');
    partnerPager.query = $('#search-requestee').val();
    partnerPager.offset = 0;
    $('#search-requestee-click').parent().parent().parent().find('span.current-page').html('&emsp;Page '+1+'&emsp;');
    $(this).parent().parent().parent().find('span.previous-page').css('opacity','0.5');

    loadItems(partnerPager)
    .then(d => {
        $(this).removeAttr('disabled');
        $('#search-requestee').removeAttr('disabled');
    })
    .catch(() => {
        $(this).removeAttr('disabled');
        $('#search-requestee').removeAttr('disabled');
    })
});

// setup next and previous page for requester
$('#requester-items-pagination').find('.next-page').click(function(e) {
    console.log('Click!');
    e.preventDefault();
    if ($(this).css('opacity') === '0.5') {
        return;
    }
    $(this).css('opacity','0.5');
    let page = currentUserPager.offset / 6;
    page++;
    $('#requester-items-pagination').find('span.current-page').html('&emsp;Page '+page+'&emsp;');
    loadItems(currentUserPager);
});
$('#requester-items-pagination').find('.previous-page').click(function(e) {
    console.log('Click!');
    e.preventDefault();
    if ($(this).css('opacity') === '0.5') {
        return;
    }
    $(this).css('opacity','0.5');
    if (!currentUserPager.areMoreAvailable) {
        currentUserPager.offset = currentUserPager.offset - 6;
    }else{
        currentUserPager.offset = currentUserPager.offset - 12;
    }
    let page = currentUserPager.offset / 6;
    page++;
    $('#requester-items-pagination').find('span.current-page').html('&emsp;Page '+page+'&emsp;');
    loadItems(currentUserPager);
});
// setup next and previous page for requestee
$('#requestee-items-pagination').find('.next-page').click(function(e) {
    console.log('Click!');
    e.preventDefault();
    if ($(this).css('opacity') === '0.5') {
        return;
    }
    $(this).css('opacity','0.5');
    let page = partnerPager.offset / 6;
    page++;
    $('#requestee-items-pagination').find('span.current-page').html('&emsp;Page '+page+'&emsp;');
    loadItems(partnerPager);
});
// setup next and previous page for requester
$('#requestee-items-pagination').find('.previous-page').click(function(e) {
    console.log('Click!');
    e.preventDefault();
    if ($(this).css('opacity') === '0.5') {
        return;
    }
    $(this).css('opacity','0.5');
    console.log(partnerPager.areMoreAvailable);
    if (!partnerPager.areMoreAvailable) {
        partnerPager.offset = partnerPager.offset - 6;
    }else{
        partnerPager.offset = partnerPager.offset - 12;
    }
    let page = partnerPager.offset / 6;
    page++;
    $('#requestee-items-pagination').find('span.current-page').html('&emsp;Page '+page+'&emsp;');
    loadItems(partnerPager);
});


$('#total-offer-value').html(`Total Value: ${formatCurrency(1, '1rem')} 0`);
$('#total-request-value').html(`Total Value: ${formatCurrency(1, '1rem')} 0`);
// add item to authenticated users offer
const setupOfferArea = () => {
    if (CurrentOffer.length !== 0 && CurrentRequest.length !== 0) {
        $('#send-trade').removeAttr('disabled');
    }else{
        $('#send-trade').attr('disabled','disabled');
    }
    $('#offer-items').empty();
    if (CurrentOffer.length === 0) {
        $('#total-offer-value').html(`Total Value: ${formatCurrency(1, '1rem')} 0`);
        $('#offer-items').append(`
        
        <div class="col-12">
            <p style="text-align:center;margin-top:2rem;opacity:0.5;font-weight:600;">You have not offered any items yet.</p>
        </div>
        
        `);
        return;
    }
    let thumbIds = [];
    let totalASP = 0;
    for (const item of CurrentOffer) {
        totalASP += item.averagePrice;
        thumbIds.push(item.catalogId);
        let serial = `<p style="font-size:0.65rem;font-weight:400;">&emsp;</p>`;
        if (item.serial) {
            serial = `<p style="font-size:0.65rem;font-weight:400;">Serial: ${number_format(item.serial)}</p>`;
        }        
        $('#offer-items').append(`
        
        <div class="col-12 remove-item-requester-items item-in-trade-request-or-offer-sidebar" style="cursor:pointer;" data-userinventoryid="${item.userInventoryId}">
            <div class="row">
                <div class="col-4">
                    <img src="${window.subsitutionimageurl}" style="width:100%;height:auto;display:block;margin:0 auto;max-width:70px;" data-catalogid="${item.catalogId}" />
                </div>
                <div class="col-8">
                    <p style="font-size:0.85rem;margin-bottom:0;font-weight:600;">${xss(item.catalogName)}</p>
                    <p style="font-size:0.65rem;margin-bottom:0;font-weight:400;">${formatCurrency(1, '0.65rem')+' '+xss(number_format(item.averagePrice))}</p>
                    ${serial}
                </div>
            </div>
            
        </div>
        `);
    }
    $('#total-offer-value').html(`Total Value: ${formatCurrency(1, '1rem')} ${number_format(totalASP)}`);
    setCatalogThumbs(thumbIds);
}
$(document).on('click', '.trade-item-requester-items', function(e) {
    e.preventDefault();
    let data = currentUserPager;
    let UserInventoryId = parseInt($(this).attr('data-userinventoryid'), 10);
    let Serial = parseInt($(this).attr('data-serial'), 10);
    let averagePrice = parseInt($(this).attr('data-averageprice'), 10);
    if (isNaN(Serial)) {
        Serial = undefined;
    }
    let CatalogId = parseInt($(this).attr('data-catalogid'));
    let Name = $(this).attr('data-catalogname');

    // check if already exists
    if (inOffer(UserInventoryId) || inRequest(UserInventoryId)) {
        return; // skip
    }
    if (CurrentOffer.length >= 4) {
        warning('You can only include up to four items, per user, in a trade.');
        return;
    }
    CurrentOffer.push({
        userInventoryId: UserInventoryId,
        catalogId: CatalogId,
        catalogName: Name,
        serial: Serial,
        averagePrice,
    });
    setupOfferArea();
    $(this).attr('class',`col-6 col-md-4 trade-card-hover remove-item-${data.div.slice(1)} item-in-trade-request-or-offer`);
});
$(document).on('click', '.remove-item-requester-items', function(e) {
    e.preventDefault();
    let data = currentUserPager;
    let UserInventoryId = parseInt($(this).attr('data-userinventoryid'), 10);

    // check if already exists
    if (inOffer(UserInventoryId) || inRequest(UserInventoryId)) {
        let _newArray = [];
        for (const item of CurrentOffer) {
            if (item.userInventoryId !== UserInventoryId) {
                _newArray.push(item);
            }
        }
        CurrentOffer = _newArray;
        $('.remove-item-requester-items.item-in-trade-request-or-offer[data-userinventoryid="'+UserInventoryId+'"]').attr('class',`col-6 col-md-4 trade-card-hover trade-item-${data.div.slice(1)}`);
        $('.remove-item-requester-items.item-in-trade-request-or-offer-sidebar[data-userinventoryid="'+UserInventoryId+'"]').remove();
        setupOfferArea();
        return;
    }
});

// add item to authenticated users request
const setupRequestArea = () => {
    if (CurrentOffer.length !== 0 && CurrentRequest.length !== 0) {
        $('#send-trade').removeAttr('disabled');
    }else{
        $('#send-trade').attr('disabled','disabled');
    }
    $('#request-items').empty();
    if (CurrentRequest.length === 0) {
        $('#total-request-value').html(`Total Value: ${formatCurrency(1, '1rem')} 0`);
        $('#request-items').append(`
        
        <div class="col-12">
            <p style="text-align:center;margin-top:2rem;opacity:0.5;font-weight:600;">You have not requested any items yet.</p>
        </div>
        
        `);
        return;
    }
    let thumbIds = [];
    let totalASP = 0;
    for (const item of CurrentRequest) {
        totalASP += item.averagePrice;
        thumbIds.push(item.catalogId);
        let serial = `<p style="font-size:0.65rem;font-weight:400;">&emsp;</p>`;
        if (item.serial) {
            console.log('item has serial!!!!!');
            serial = `<p style="font-size:0.65rem;font-weight:400;">Serial: ${number_format(item.serial)}</p>`;
        }        
        $('#request-items').append(`
        
        <div class="col-12 remove-item-requestee-items item-in-trade-request-or-offer-sidebar" style="cursor:pointer;" data-userinventoryid="${item.userInventoryId}">
            <div class="row">
                <div class="col-4">
                    <img src="${window.subsitutionimageurl}" style="width:100%;height:auto;display:block;margin:0 auto;max-width:70px;" data-catalogid="${item.catalogId}" />
                </div>
                <div class="col-8">
                    <p style="font-size:0.85rem;margin-bottom:0;font-weight:600;">${xss(item.catalogName)}</p>
                    <p style="font-size:0.65rem;margin-bottom:0;font-weight:400;">${formatCurrency(1, '0.65rem')+' '+xss(number_format(item.averagePrice))}</p>
                    ${serial}
                </div>
            </div>
            
        </div>
        `);
    }
    $('#total-request-value').html(`Total Value: ${formatCurrency(1, '1rem')} ${number_format(totalASP)}`);
    setCatalogThumbs(thumbIds);
}
$(document).on('click', '.trade-item-requestee-items', function(e) {
    e.preventDefault();
    let data = partnerPager;
    let UserInventoryId = parseInt($(this).attr('data-userinventoryid'), 10);
    let Serial = parseInt($(this).attr('data-serial'), 10);
    let averagePrice = parseInt($(this).attr('data-averageprice'), 10);
    if (isNaN(Serial)) {
        Serial = undefined;
    }
    let CatalogId = parseInt($(this).attr('data-catalogid'));
    let Name = $(this).attr('data-catalogname');

    // check if already exists
    if (inOffer(UserInventoryId) || inRequest(UserInventoryId)) {
        return; // skip
    }
    if (CurrentRequest.length >= 4) {
        warning('You can only include up to four items, per user, in a trade.');
        return;
    }
    CurrentRequest.push({
        userInventoryId: UserInventoryId,
        catalogId: CatalogId,
        catalogName: Name,
        serial: Serial,
        averagePrice: averagePrice,
    });
    setupRequestArea();
    $(this).attr('class',`col-6 col-md-4 trade-card-hover remove-item-${data.div.slice(1)} item-in-trade-request-or-offer`);
});
$(document).on('click', '.remove-item-requestee-items', function(e) {
    e.preventDefault();
    let data = partnerPager;
    let UserInventoryId = parseInt($(this).attr('data-userinventoryid'), 10);

    // check if already exists
    if (inOffer(UserInventoryId) || inRequest(UserInventoryId)) {
        let _newArray = [];
        for (const item of CurrentRequest) {
            if (item.userInventoryId !== UserInventoryId) {
                _newArray.push(item);
            }
        }
        CurrentRequest = _newArray;
        $('.remove-item-requestee-items.item-in-trade-request-or-offer[data-userinventoryid="'+UserInventoryId+'"]').attr('class',`col-6 col-md-4 trade-card-hover trade-item-${data.div.slice(1)}`);
        $('.remove-item-requestee-items.item-in-trade-request-or-offer-sidebar[data-userinventoryid="'+UserInventoryId+'"]').remove();
        setupRequestArea();
        return;
    }
});

$(document).on('click', '#send-trade', function(e) {
    questionYesNo('Are you sure you want to send this trade?', function(e) {
        loading();
        let requesteeUserInventoryIds = [];
        CurrentOffer.forEach(i => requesteeUserInventoryIds.push(i.userInventoryId));
        let requestedUserInventoryIds = [];
        CurrentRequest.forEach(i => requestedUserInventoryIds.push(i.userInventoryId));
        //questionYesNo('Sending trade...', function() {
            request('/user/'+traderId+'/trade/request', 'PUT', {
                offerItems: requesteeUserInventoryIds,
                requestedItems: requestedUserInventoryIds,
            }).then(d => {
                success('Your trade has been sent. You can review its status in the trades page.', () => {
                    window.location.reload();
                })
            })
            .catch(e => {
                console.error(e);
                if (e && e.responseJSON && e.responseJSON.message) {
                    warning(e.responseJSON.message);
                }else{
                    let code = 'UnknownException';
                    if (e && e.responseJSON && e.responseJSON.error && e.responseJSON.error.code) {
                        code = e.responseJSON.error.code;
                    }
                    warning('An unknown error has occurred. Please try again. Code: '+code)
                }
            })
        //});
    });
});