let arr_collection_type = []
value_id = 0
param_id = 0
$('form').on("change", ".type-parameter",function(){
    var curentSelectedVal = $(this).find('option:selected').val();
    if (curentSelectedVal == 2) {
        $(`.block-for-col-param-choice#${param_id} .row.parameter-number`).css('display','flex');
        $(`.block-for-col-param-choice#${param_id} .row.parameter-string`).css('display','none');
    } else if(curentSelectedVal == 3){
        $(`.block-for-col-param-choice#${param_id} .row.parameter-string`).css('display','flex');
        $(`.block-for-col-param-choice#${param_id} .row.parameter-number`).css('display','none');
    }
});

const addParam = () => {
    let typeConteiner = document.createElement('div');
    typeConteiner.innerHTML = $(".block-for-col-param-choice")[0].innerHTML
    typeConteiner.className = "block-for-col-param-choice"
    param_id=param_id+1
    typeConteiner.id=param_id
    console.log(typeConteiner)
    $(".content")[0].append(typeConteiner)
    console.log($('#type-parameter'))
    
}
const deleteParam = () => {
    if ($(".row.collection-type-").length >1 || arr_collection_type.length > 0){
        $(`#${arr_collection_type[arr_collection_type.length - 1]}`).remove()
        arr_collection_type.pop()
        value_id= value_id - 1
    }
}
const addType = () => {
    let typeConteiner = document.createElement('div');
    typeConteiner.innerHTML = $(".block-for-col_type")[0].innerHTML
    arr_collection_type.push(value_id)
    typeConteiner.id=value_id
    $(".content")[0].append(typeConteiner)
    value_id= value_id+1
}
const deleteType = () => {
    if ($(".row.collection-type-").length >1 || arr_collection_type.length > 0){
        $(`#${arr_collection_type[arr_collection_type.length - 1]}`).remove()
        arr_collection_type.pop()
        value_id= value_id - 1
    }
}
