/* 初始化表单 */
$('form.builder-create-form').each(function () {
    let formId = '#' + $(this).attr('id');
    let validateConfigFields = $(formId + '_validate_config').val();
    let redirectUrl = $(formId + '_redirect_url').val();
    createBootstrapValidator(formId, validateConfigFields, redirectUrl);
});

/* 初始化 日期范围选择器 */
$('.daterangepicker-input').each(function () {
    let id = '#' + $(this).attr('id');
    let startDate = $(this).attr('data-start-date');
    let endDateDate = $(this).attr('data-end-date');
    createDateRangepicker(id, startDate, endDateDate);
});

/* 初始化底图选点器 */
$('.qq-map-group').each(function () {
    let id = $(this).attr('id');
    qqMapInit('map-container-' + id, 'map-address-' + id, 'ma-location-' + id);
});

$(document).on('click', '.map-toggle-btn', function () {
    $('#' + $(this).attr('data-container')).toggle(800);
});

/* 初始化标签输入框 */
$('.bootstrap-tagsinput-role').tagsinput({
    tagClass: function (item) {
        return 'btn btn-info btn-sm';
    }
});

/* 初始化颜色选择器 */
$('.colorpicker-group-item').each(function () {
    let id = '#' + $(this).attr('id');
    $(id).colorpicker({format: $(this).attr('data-format')});
});

/* 重置表单按钮 */
$(document).on("click", "form .form-reset-btn", function () {
    $(this).parents("form.builder-create-form").bootstrapValidator("resetForm");
});

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

/* 表单验证提交 */
function createBootstrapValidator(formId, validateConfigFields, redirectUrl) {
    let validateConfig = {};
    validateConfig.message = '表单验证未通过';
    validateConfig.feedbackIcons = {
        valid: 'fa fa-check',
        invalid: 'fa fa-times',
        validating: 'fa fa-refresh'
    };
    validateConfig.fields = eval('(' + validateConfigFields + ')');
    $(formId).bootstrapValidator(validateConfig).on('success.form.bv', function (e) {
        e.preventDefault();
        if (typeof CKEDITOR !== 'undefined') {
            var ckeditorInstance;
            for (ckeditorInstance in CKEDITOR.instances) {
                CKEDITOR.instances[ckeditorInstance].updateElement();
            }
        }
        if ($(e.target).attr('action') === '' || $(e.target).attr('action') === null) {
            $(formId).bootstrapValidator('disableSubmitButtons', false);
            return false;
        }
        $.ajax({
            url: $(e.target).attr('action'),
            type: $(e.target).attr('method'),
            data: $(e.target).serialize(),
            dataType: 'json',
            success: function (re) {
                if (re.code === 1) {
                    $(formId)[0].reset();
                    $(formId).bootstrapValidator('resetForm');
                    alertNotify(re.msg, 'success');
                    if (re.url && re.url !== '' && re.url !== null) {
                        redirectUrl = re.url;
                    }
                    if (typeof redirectUrl !== 'undefined' && redirectUrl !== '' && redirectUrl !== null) {
                        setTimeout(function () {
                            window.location.href = redirectUrl;
                        }, 1500);
                    }
                } else {
                    $(formId).bootstrapValidator('disableSubmitButtons', false);
                    alertNotify(re.msg, 'danger');
                }
            },
            error: function () {
                $(formId).bootstrapValidator('disableSubmitButtons', false);
                alertNotify('网络错误,请重试...', 'danger');
            }
        });
    });
}

/* 创建日期范围选择器 */
function createDateRangepicker(id, startDate, endDateDate) {
    let dateRangepickerConfig = {
        locale: {
            opens: 'left',
            drops: 'down',
            format: 'YYYY-MM-DD HH:mm:ss',
            separator: "~",
            applyLabel: "确定",
            cancelLabel: "取消",
            fromLabel: "起始时间",
            toLabel: "结束时间'",
            customRangeLabel: "自定义",
            weekLabel: "周",
            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            firstDay: 1
        },
        autoApply: true,
        timePicker: true,
        timePickerSeconds: true,
        timePickerIncrement: 1,
        timePicker24Hour: true,
        alwaysShowCalendars: true,
        showWeekNumbers: true,
        showISOWeekNumbers: true,
        startDate: moment().startOf('day'),
        endDate: moment().startOf('day'),
        //汉化按钮部分
        ranges: {
            '今日': [moment().startOf('day'), moment().endOf('day')],
            '昨日': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
            '最近7日': [moment().subtract(6, 'days'), moment()],
            '最近30日': [moment().subtract(29, 'days'), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    };
    if (endDateDate !== '' && startDate !== '') {
        dateRangepickerConfig.startDate = startDate;
        dateRangepickerConfig.endDate = endDateDate;
    }
    $(id).daterangepicker(dateRangepickerConfig);
}