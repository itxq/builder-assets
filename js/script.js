/* 删除json表单项 */
$(document).on('click', '.form-json-group .form-json-group-core .form-json-delete', function () {
    if ($(this).parents('.form-json-item').siblings('.form-json-item').length >= 1) {
        $(this).parents('.form-json-item').remove();
    }
});
/* 添加json表单项 */
$(document).on('click', '.form-json-group .form-json-group-add .form-json-add', function () {
    var html = $(this).parents('.form-json-group-add').siblings('.form-json-group-demo').html();
    html = html.replace(/disabled/ig, '');
    $(this).parents('.form-json-group-add').siblings('.form-json-group-core').append(html);
});

/** Ajax联动 */
function addTrigger(name, subName, url, isReady, formID, triggerObj) {
    $(document).ready(function () {
        if (isReady) {
            var _name = $('[name="' + name + '"]');
            var _this_val = _name.val();
            if (_name.is('input')) {
                _this_val = $('[name="' + name + '"]:checked').val();
            }
            ajaxSelect(url, _this_val, subName, formID, triggerObj);
        }
    });
    
    $(document).on('change', '[name="' + name + '"]', function () {
        var data = $(this).val();
        ajaxSelect(url, data, subName, formID, triggerObj);
    });
}

/* Ajax 联动操作 */
function ajaxSelect(url, data, subName, formID, triggerObj) {
    var ajaxData = {data: data};
    if (formID && formID !== '' && formID !== null) {
        ajaxData = $('#' + formID).serialize();
    }
    $.ajax({
        url: url,
        type: 'GET',
        data: ajaxData,
        dataType: 'json',
        success: function (re) {
            var html = '';
            if (re.code === 1 && re.data !== null && re.data !== '' && re.data.length >= 1) {
                var data = re.data;
                for (var i = 0; i < data.length; i++) {
                    var value = data[i].value;
                    var desc = data[i].desc;
                    var check = data[i].check;
                    if (check === 'true') {
                        html += '<option value="' + value + '" selected="selected">' + desc + '</option>'
                    } else {
                        html += '<option value="' + value + '">' + desc + '</option>'
                    }
                }
            }
            var select = $('select[name="' + subName + '"]');
            select.html(html);
            if (triggerObj && triggerObj !== '' && triggerObj !== null) {
                $('select[name="' + triggerObj + '"]').trigger("change");
            }
        }
    });
}

/* Ajax 显示隐藏 */
function showOrHide(controllerName, targetName, value) {
    value = value.split(",");
    var _name = $('[name="' + controllerName + '"]');
    var _this_val = _name.val();
    $(document).ready(function () {
        if (_name.is('input')) {
            _this_val = $('[name="' + controllerName + '"]:checked').val();
        }
        checkShowOrHide(_this_val, value, targetName);
    });
    $(document).on('change', '[name="' + controllerName + '"]', function () {
        checkShowOrHide($(this).val(), value, targetName);
    });
}

/* 检查隐藏显示状态 */
function checkShowOrHide(_val, value, targetName) {
    var check = parseInt($.inArray(_val, value));
    var _target = $('[name="' + targetName + '"]');
    if (check === -1) {
        _target.attr('disabled', 'disabled');
        _target.parents('div.form-group').hide();
    } else {
        _target.removeAttr('disabled');
        _target.parents('div.form-group').show();
    }
}

/* 密码框显示/隐藏 */
$(document).on('click', '.password-input .password-controller', function () {
    var obj = $(this).parent('.input-group-btn').siblings('input.form-control');
    var controllerObj = $(this);
    if (obj.attr('type') === 'password') {
        obj.attr('type', 'text');
        controllerObj.html('隐藏');
    } else {
        obj.attr('type', 'password');
        controllerObj.html('显示');
    }
});

/* 分组多选展开折叠 */
$(document).on('click', '.map-group .panel-heading', function () {
    if ($(this).find('.panel-control i').hasClass("fa-chevron-up")) {
        $(this).find('.panel-control i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else {
        $(this).find('.panel-control i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
    $(this).siblings('.group-sub').toggle();
});

/* 用于多选后发起ajax请求 */
function doAJaxCheckALL(title, errTitle, url, ajaxCallbackUrl, isTable, id) {
    let data = getCheckboxSon("son[]", id);
    if (data.length < 1) {
        alertNotify(errTitle, 'danger');
        return false;
    }
    var _trueBtn = '<span class="text-light"><i class="fa fa-check"></i>&nbsp;确定</span>';
    var _falseBtn = '<span class="text-dark"><i class="fa fa fa-times"></i>&nbsp;取消</span>';
    layer.msg(title, {
        time: 0,
        btn: [_trueBtn, _falseBtn],
        yes: function (index) {
            layer.close(index);
            doAjax(url, 'POST', data, ajaxCallbackUrl, isTable);
        }
    });
}

/* 获取选中的CheckBox并以数组返回 */
function getCheckboxSon(name, id) {
    let data = [];
    let childBox;
    if (!id || id === '' || id === null) {
        childBox = $('input[name="' + name + '"]');
    } else {
        childBox = $('#' + id + ' input[name="' + name + '"]');
    }
    childBox.each(function () {
        if ($(this).is(':checked')) {
            data.push($(this).val())
        }
    });
    return data;
}

/* ajax请求 */
function doAjax(ajaxUrl, ajaxType, ajaxData, ajaxCallbackUrl, isTable) {
    $.ajax({
        url: ajaxUrl,
        type: ajaxType,
        data: {data: ajaxData},
        dataType: 'json',
        success: function (re) {
            re.code = parseInt(re.code);
            if (re.code !== 1) {
                alertNotify(re.msg, 'danger');
            } else if (re.code === 1 && ajaxCallbackUrl !== 'false') {
                alertNotify(re.msg, 'success');
                setTimeout(function () {
                    window.location.href = ajaxCallbackUrl;
                }, 2000)
            } else if (re.code === 1 && isTable === 'true') {
                alertNotify(re.msg, 'success');
                $('table').bootstrapTable('refresh');
            } else {
                alertNotify(re.msg, 'success');
            }
        },
        error: function (re) {
            alertNotify(re.msg, 'danger');
            $('.ajax.ajax-action').removeClass('ajax-action');
        }
    });
}

/* 弹框提示 */
function alertNotify(msg, type) {
    layer.msg(msg);
}