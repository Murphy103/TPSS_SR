var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	
	var status_cd = [{ "id": "1002", "text": "审批通过" },
	                 { "id": "1003", "text": "审批不通过" }];
	
	mini.get("STATUS_CD").setData(status_cd);
	JsVar["approval_form"] = new mini.Form("#approval_form");
});

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
	//父窗口参数
    JsVar["data"] = data;
}

/**
 * 审批活动
 */
function onSubmit() {
    JsVar["approval_form"].validate();
    if (JsVar["approval_form"].isValid() == false){
        return;
    }
    
    //获取表单多个控件的数据
    var approvalInfo = JsVar["approval_form"].getData();
    approvalInfo['ACTIVITY_ID'] = JsVar["data"]["ACTIVITY_ID"];
    approvalInfo['service_name'] = "PRICING_OFFER_APPROVAL";
    approvalInfo['oper_flag'] = "U";
    
    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,approvalInfo,"审批活动",
	        function(result){
		    	approvalInfo["success"] = result.success;
		    	approvalInfo["errormsg"] = result.errormsg;
		        closeWindow(approvalInfo);
	        });
}