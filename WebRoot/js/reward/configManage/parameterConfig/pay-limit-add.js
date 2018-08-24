var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

var JsVar = new Object();
var netElementData=new Object();
var old_PAY_ACCT_ID;

$(document).ready(function () {
    mini.parse();
    JsVar["PAY_ACCT_ID"]= mini.get("PAY_ACCT_ID");
    JsVar["addevent"] = new mini.Form("#addevent");
    getPayAcctComboxData();

});

/**
 * 获取发放账户下拉选数据
 */
function getPayAcctComboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_INIT_PAY_ACCT"};
	var logName="发放账户";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["PAY_ACCT_ID"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["PAY_ACCT_ID"].select(0);
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
    
   var url;
  if(old_PAY_ACCT_ID==mini.get("PAY_ACCT_ID").getValue()){//老账户不校验
	  url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=updateData&sqlCode=PAY_QUOTA_U';
  }else{
	  url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=updateData&checkServiceName=PAY_QUOTA&sqlCode=PAY_QUOTA_U';
  }
    
    var eventInfo = JsVar["addevent"].getData();
    eventInfo["PAY_ACCT_NAME"] = mini.get("PAY_ACCT_ID").getText();
    getJsonDataByPost(url,eventInfo,"修改限额配置",
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

    
    var eventInfo = JsVar["addevent"].getData();
    eventInfo["PAY_ACCT_NAME"] = mini.get("PAY_ACCT_ID").getText();
    var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=insertData&checkServiceName=PAY_QUOTA&sqlCode=PAY_QUOTA_A';
    getJsonDataByPost(url,eventInfo,"新增限额配置",
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
        initData(data);
    }else if(action == systemVar.ADD){
    	
    }
}

/**
 * 修改时初始化数据
 * @param data
 */
function initData(data){
	JsVar["addevent"].setData(data);
	old_PAY_ACCT_ID=mini.get("PAY_ACCT_ID").getValue();
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