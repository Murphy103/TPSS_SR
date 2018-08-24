var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

var JsVar = new Object();
var netElementData=new Object();

var OLD_MERCHANT_ACCT="";

$(document).ready(function () {
    mini.parse();
    JsVar["IS_TELECOM_ACCT"]= mini.get("IS_TELECOM_ACCT_ID");//是否电信账户下拉
    JsVar["LATN_NAME"]= mini.get("LATN_NAME_ID");//本地网下拉
    JsVar["addevent"] = new mini.Form("#addevent");
    getisTelecomAcctComboboxData();
    getLatnComboboxData();
    

});

/**
 * 是否电信账户下拉
 */
function getisTelecomAcctComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"IS_TELECOM_ACCT"};
	var logName="是否电信账户";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["IS_TELECOM_ACCT"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["IS_TELECOM_ACCT"].select(0);
					}
					
				}
		});
}

/**
 * 本地网下拉
 */
function getLatnComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"QUERYLATN"};
	var logName="本地网";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["LATN_NAME"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["LATN_NAME"].select(0);
					}
					
				}
		});
}

/**
 * 增加一行
 */
function add(){
	var scriptHtml='<tr id="s_tr">'+
		'<td style="width:20%;height:30px" align="center"><input  name="s_id" style="width:80%;height:70%" required="true"/></td>'+
		'<td style="width:20%;height:30px" align="center"><input  name="column_code" style="width:80%;height:70%" /></td>'+
		'<td style="width:20%;height:30px" align="center"><input  name="column_name" style="width:80%;height:70%" /></td>'+
		'<td style="width:20%;height:30px" align="center"><input  name="default_value" style="width:80%;height:70%" /></td>'+
		'<td style="width:20%;height:30px" align="center"><a  onclick="del(this)"><font color=blue><u>删除</u></font></a></td></tr>';
	$("#table2").append(scriptHtml);
	JsVar["table2"] = new mini.Form("#table2");
}

/**
 * 删除一行
 * @param e
 */
function del(obj){
	$(obj).parent().parent().remove();
}


//新增和修改点确认按钮保存
function onSubmit() {
    if (JsVar[systemVar.ACTION] == systemVar.EDIT) {
        update();
    } else {
        save();
    }
	
//	save();
}

/**
 * 修改页面点确定
 */
function update(){
    JsVar["addevent"].validate();
    if (JsVar["addevent"].isValid() == false){
        return;
    }
    
    
    
    var eventInfo = JsVar["addevent"].getData();
    eventInfo["oper_flag"] = 'U';
    eventInfo["service_name"] = 'PAY_ACCT_U';
    eventInfo["PAY_ACCT_ID"] = JsVar["PAY_ACCT_ID"];
    if(OLD_MERCHANT_ACCT==mini.get("MERCHANT_ACCT").getValue()){//老商家企业用户不校验
    	eventInfo["check_flag"] = false;
    }else{
    	eventInfo["check_flag"] = true;
    }
    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,eventInfo,"修改发放账户",
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
 * 新增点确定
 */
function save(){
	JsVar["addevent"].validate();
	
    if (JsVar["addevent"].isValid() == false){
	  return;
    }	
    var eventInfo = JsVar["addevent"].getData();
    eventInfo["oper_flag"] = 'A';
    eventInfo["service_name"] = 'PAY_ACCT_A';
    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,eventInfo,"新增限额配置",
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

function handleData(url,data,message1,message2){
	getJsonDataByPost(url,data,message1,
            function (result){
		    	if(result.success != undefined && result.success=='success'){
					window.CloseOwnerWindow("success");
				}else if(result.success != undefined && result.success=='fail'){
					showMessageAlter(result.errormsg);
				}else{
					showMessageAlter(message2);
				}
            });
}

function onLoadComplete(action,data) {
    JsVar[systemVar.ACTION] = action;
    if (action == systemVar.EDIT) {
        initData(data);
    }
}

/**
 * 修改时初始化数据
 * @param data
 */
function initData(data){
	JsVar["addevent"].setData(data);
	JsVar["PAY_ACCT_ID"]=data.PAY_ACCT_ID;
	OLD_MERCHANT_ACCT=data.MERCHANT_ACCT;
}
 