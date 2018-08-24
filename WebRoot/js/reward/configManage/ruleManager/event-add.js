var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

var JsVar = new Object();
var netElementData=new Object();

$(document).ready(function () {
    mini.parse();
    JsVar["TYPE"]= mini.get("TYPE");
    JsVar["addevent"] = new mini.Form("#addevent");
    getChannelBigComboboxData();

});

/**
 * 加载事件大类下拉选
 */
function getChannelBigComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"SUM_EVENT_TYPE",sV1:1,sV2:2};
	var logName="事件大类";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					netElementData=jsonData;
					JsVar["TYPE"].setData(netElementData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["TYPE"].select(0);
					}
				}
		});
}

//新增和修改点确认按钮保存
function onSubmit() {
    if (JsVar[systemVar.ACTION] == systemVar.EDIT) {
        update();
    } else {
        save();
    }
}

/**
 * 修改页面点确定
 */
function update(){
    JsVar["addevent"].validate();
    if (JsVar["addevent"].isValid() == false){
        return;
    }
    
    var eff_data_in=mini.get("EFF_DATE").getValue();//Sat Jul 01 2017 00:00:00 GMT+0800
	var exp_date_in=mini.get("EXP_DATE").getValue();
	if(eff_data_in>exp_date_in){
		showWarnMessageAlter("生效时间必须小小于失效时间!");
		return;
	}
    
    var eventInfo = JsVar["addevent"].getData();
    eventInfo["EVENT_TYPE_ID"] = JsVar["EVENT_TYPE_ID"];
    var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=updateData&sqlCode=EVENT_ALLOCATION_U';
    getJsonDataByPost(url,eventInfo,"修改事件",
        function (result){
		    	if(result.success != undefined && result.success=='success'){
					window.CloseOwnerWindow("success");
				}else if(result.success != undefined && result.success=='fail'){
					showMessageAlter(result.errormsg);
				}else{
					showMessageAlter("修改失败!");
				}
        });
}

/**
 * 新增页面点确定
 */
function save(){
	JsVar["addevent"].validate();
    if (JsVar["addevent"].isValid() == false){
        return;
    }
	var eff_data_in=mini.get("EFF_DATE").getValue();//Sat Jul 01 2017 00:00:00 GMT+0800
	var exp_date_in=mini.get("EXP_DATE").getValue();
	if(eff_data_in>exp_date_in){
		showWarnMessageAlter("生效时间必须小小于失效时间!");
		return;
	}

    
    var eventInfo = JsVar["addevent"].getData();
    var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=insertData&sqlCode=EVENT_ALLOCATION_A';
    getJsonDataByPost(url,eventInfo,"新增事件",
            function (result){
    	
		    	if(result.success != undefined && result.success=='success'){
					window.CloseOwnerWindow("success");
				}else if(result.success != undefined && result.success=='fail'){
					showMessageAlter(result.errormsg);
				}else{
					showMessageAlter("新增失败!");
				}
            });
    
}

function onLoadComplete(action,data) {
    JsVar[systemVar.ACTION] = action;
    if (action == systemVar.EDIT) {
//    	alert("初始化数据:"+JSON.stringify(data));
        initData(data);
    }else if(action == systemVar.ADD){
    	initEventCodeData();
    }
}

/**
 * 修改时初始化数据
 * @param data
 */
function initData(data){
//	mini.get("#EVENT_TYPE_CODE").setValue(data.EVENT_TYPE_CODE);
//	mini.get("#NAME").setValue(data.NAME);
//	mini.get("#TYPE").setValue(data.TYPE);
//	mini.get("#EXP_DATE").setValue();
//	mini.get("#EXP_DATE").setValue();
	JsVar["addevent"].setData(data);
	if(data.TYPE=='客户交互事件'){
		mini.get("#TYPE").setValue('48A');
	}else if(data.TYPE=='使用事件'){
		mini.get("#TYPE").setValue('48B');
	}else if(data.TYPE=='混合事件'){
		mini.get("#TYPE").setValue('48C');
	}
	JsVar["EVENT_TYPE_ID"] = data.EVENT_TYPE_ID;
}

/**
 * 事件编码初始化数据
 */
function initEventCodeData(){
	var initEventCode='SR'+getNowFormatDate();
	var date = new Date();
	var firstDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-1";//本月第一天
	var lastDay=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+new Date(date.getFullYear(),(date.getMonth()+1),0).getDate();//本月最后一天
	mini.get("#EVENT_TYPE_CODE").setValue(initEventCode);
	mini.get("#EFF_DATE").setValue(firstDay+" 00:00:00");
	mini.get("#EXP_DATE").setValue(lastDay+" 00:00:00");
}

/**
 * 取当前时间
 * @returns {String}
 */
function getNowFormatDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour=date.getHours();
    var minute=date.getMinutes();
    var second=date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
    	hour = "0" + hour;
    }
    if (minute >= 0 && minute <= 9) {
    	minute = "0" + minute;
    }
    if (second >= 0 && second <= 9) {
    	second = "0" + second;
    }
    var currentdate = date.getFullYear() + month + strDate
            + hour  + minute+ second;
    return currentdate;
} 