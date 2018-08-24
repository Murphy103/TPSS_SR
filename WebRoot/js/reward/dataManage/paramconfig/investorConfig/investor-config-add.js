var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

var JsVar = new Object();
var netElementData=new Object();
var old_CHARGE_PARTY_NAME;

$(document).ready(function () {
    mini.parse();
    JsVar["CHARGE_PARTY_TYPE_ID"]= mini.get("CHARGE_PARTY_TYPE_ID");
    JsVar["addevent"] = new mini.Form("#addevent");
    getInvestorComboxData();

});

/**
 * 获取出资方属性下拉选数据
 */
function getInvestorComboxData(){
	var data={sqlcode:"COM_INIT_BY_PTYCODE1",sV1:'CHARGE_PARTY_TYPE',sV2:'0'};
	var logName="出资方属性下拉";
	getJsonDataByPost(Globals.baseActionUrl.COMBOBOX_URL,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["CHARGE_PARTY_TYPE_ID"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["CHARGE_PARTY_TYPE_ID"].select(0);
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
   var eventInfo = JsVar["addevent"].getData();
   eventInfo["oper_flag"] = 'U';
   eventInfo["service_name"] = 'CHARGE_PARTY_U';
   eventInfo["CHARGE_PARTY_ID"] = JsVar["CHARGE_PARTY_ID"];
  if(old_CHARGE_PARTY_NAME==mini.get("CHARGE_PARTY_NAME").getValue()){//老出资方名称不校验
	  eventInfo["check_flag"] = false;
  }else{
	  eventInfo["check_flag"] = true;
  }
    
    
    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,eventInfo,"修改出资方配置",
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
    var amount=mini.get("CHARGE_PARTY_AMOUNT").getValue();
    if(amount==null || amount==''){
    	eventInfo["CHARGE_PARTY_AMOUNT"]=0;
    }
    eventInfo["service_name"]="CHARGE_PARTY_A";
    eventInfo["oper_flag"]="A";

    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,eventInfo,"新增出资方配置",
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
	JsVar["CHARGE_PARTY_ID"]=data.CHARGE_PARTY_ID;
	old_CHARGE_PARTY_NAME=mini.get("CHARGE_PARTY_NAME").getValue();
}
