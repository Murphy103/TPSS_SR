var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

var JsVar = new Object();
var netElementData=new Object();

var old_sql_code="";
var script_flag="0";

$(document).ready(function () {
    mini.parse();
    JsVar["factor_classify"]= mini.get("factor_classify");//因子分类下拉
    JsVar["value_source"]= mini.get("value_source");//取值来源下拉
    JsVar["addevent"] = new mini.Form("#addevent");
    JsVar["table2"] = new mini.Form("#table2");
    getfacClassifyComboboxData();
    getValueSourceComboboxData();
    

});

/**
 * 因子分类下拉
 */
function getfacClassifyComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_INIT_BY_PTYCODE1",sV1:'REF_CLASS',sV2:'0'};
	var logName="因子分类";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["factor_classify"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["factor_classify"].select(0);
					}
					
				}
		});
}

/**
 * 取值来源下拉
 */
function getValueSourceComboboxData(){
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=combList';
	var data={sqlcode:"COM_INIT_BY_PTYCODE1",sV1:'DATA_GET_TYPE',sV2:'0'};
	var logName="因子分类";
	getJsonDataByPost(url,data,logName,
			function(result){
		var jsonData=result.data;
				if(jsonData.length>0){
					JsVar["value_source"].setData(jsonData);
					if (JsVar[systemVar.ACTION] == systemVar.EDIT){
					}else{
						JsVar["value_source"].select(0);
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
//    if (JsVar[systemVar.ACTION] == systemVar.EDIT) {
//        update();
//    } else {
//        save();
//    }
	
	save();
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
 * 新增点确定
 */
function save(){
	script_flag="0";
	JsVar["addevent"].validate();
	
  if (JsVar["addevent"].isValid() == false){
	  return;
  }	
  	var data = {};
	var scriptinfo=[];
	
	var factor_code=mini.get("factor_code").getValue();//因子编码
	var sql_code=factor_code.replace("[","").replace("]","");
	
	var p_id=$.trim($('input[name="p_id"]').val());
	
	var reg=/^[-+]?\d*$/; 

	$('tr[id="s_tr"]').each(function(){
		var curFieldSet=$(this);
		var s_id=$.trim($('input[name="s_id"]',curFieldSet).val());
		var column_code=$.trim($('input[name="column_code"]',curFieldSet).val());
		var column_name=$.trim($('input[name="column_name"]',curFieldSet).val());
		var default_value=$.trim($('input[name="default_value"]',curFieldSet).val());
		if(s_id==null || s_id==''){
			script_flag="1";
			showWarnMessageAlter("序号不能为空!");
			return;
		}else if(!reg.test(s_id)){ 
			script_flag="1";
			showWarnMessageAlter("序号必须为整数!");
			return;
		}if(column_code==null || column_code==''){
			script_flag="1";
			showWarnMessageAlter("列编码不能为空!");
			return;
		}if(column_name==null || column_name==''){
			script_flag="1";
			showWarnMessageAlter("列名称不能为空!");
			return;
		}if(default_value==null || default_value==''){
			script_flag="1";
			showWarnMessageAlter("默认值不能为空!");
			return;
		}else{
			var curScriptInfo={};
			curScriptInfo.s_id=s_id;
			curScriptInfo.column_code=column_code;
			curScriptInfo.column_name=column_name;
			curScriptInfo.default_value=default_value;
			curScriptInfo.sql_code=sql_code;
			if(JsVar[systemVar.ACTION] == systemVar.EDIT){
				curScriptInfo.deal_flag="DA";
			}else{
				curScriptInfo.deal_flag="A";
			}
			
			scriptinfo.push(curScriptInfo);
		}
		
		
	});
	
	data.scriptinfo=scriptinfo;
	//{"factor_classify":"1000","factor_code":"1","factor_name":"2","value_source":"1","value_key":"3","value_tip":"4","value_sql":"5"}
	data.factorinfo=JsVar["addevent"].getData();
	
	data.factorinfo.sql_code=sql_code;
	
	
	if (JsVar[systemVar.ACTION] == systemVar.EDIT) {
		if(scriptinfo.length==0){
			var curScriptInfo={};
			curScriptInfo.deal_flag="D";
			curScriptInfo.sql_code=sql_code;
			scriptinfo.push(curScriptInfo);
		}
		var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=dealData&sqlCode=PRICING_REF_OBJECT_MOD1U,PRICING_REF_OBJECT_MOD2U,PRICING_REF_OBJECT_MOD3U';
		var params = {};
		params.PRICING_REF_OBJECT_MOD1U=data.factorinfo;
		params.PRICING_REF_OBJECT_MOD2U=data.factorinfo;
		params.PRICING_REF_OBJECT_MOD3U=data.scriptinfo;
		params.PRICING_REF_OBJECT_MOD1U.deal_flag="U";
		params.PRICING_REF_OBJECT_MOD2U.deal_flag="U";
		if(script_flag !="1"){
			handleData(url,params,"修改因子","修改失败!");
		}
		
	}else{
		var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=dealData&sqlCode=PRICING_REF_OBJECT_MOD1,PRICING_REF_OBJECT_MOD2,PRICING_REF_OBJECT_MOD3';
		var params = {};
		params.PRICING_REF_OBJECT_MOD1=data.factorinfo;
		params.PRICING_REF_OBJECT_MOD2={sql_code:data.factorinfo.sql_code,factor_name:data.factorinfo.factor_name,value_sql:data.factorinfo.value_sql};
		params.PRICING_REF_OBJECT_MOD3=data.scriptinfo;
		params.PRICING_REF_OBJECT_MOD1["check_service_name"]="PRICING_REF_OBJECT_MOD1";
		params.PRICING_REF_OBJECT_MOD1.deal_flag="A";
		params.PRICING_REF_OBJECT_MOD2.deal_flag="A";
		if(script_flag !="1"){
			handleData(url,params,"新增因子","新增失败!");
		}
		
	}
    
    
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
	mini.get("#factor_classify").setValue(data.BUSI_CODE);
	mini.get("#factor_code").setValue(data.REF_OBJ_CODE);
	mini.get("#factor_name").setValue(data.OBJ_NAME);
	mini.get("#value_source").setValue(data.DATA_GET_TYPE);
	mini.get("#value_key").setValue(data.REFERENCE_OBJECT_KEY);
	mini.get("#value_tip").setValue(data.RIGHT_TIP);
	mini.get("#value_sql").setValue(data.SQL_DESC);
	
	//因子编码置灰
	mini.get("#factor_code").setEnabled(false);
	
	var sql_code=data.REF_OBJ_CODE.replace("[","").replace("]","");
	old_sql_code=sql_code;
	
	//获取输出列信息
	var url=nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue';
	var data={service_name:"QUERYCOLUMN",SQL_CODE:sql_code};
	var logName="输出列信息";
	getJsonDataByPost(url,data,logName,
			function(result){
//		alert(JSON.stringify(result));
//		[{"COL_CODE":"a","COL_NAME":"aa","COL_NO":11,"DEFAULTVALUE":"aaa"},
//		{"COL_CODE":"b","COL_NAME":"bb","COL_NO":12,"DEFAULTVALUE":"bbb"}]
		//[]
		if(result.length>0){
			for(var i=0;i<result.length;i++){
				add();
				var curFieldSet=$('tr[id="s_tr"]').last();
         		$('input[name="s_id"]',curFieldSet).val(result[i].COL_NO);
	  			$('input[name="column_code"]',curFieldSet).val(result[i].COL_CODE);
	   			$('input[name="column_name"]',curFieldSet).val(result[i].COL_NAME);
	   			$('input[name="default_value"]',curFieldSet).val(result[i].DEFAULTVALUE);
	   			
			}
		}
		});
//	JsVar["EVENT_TYPE_ID"] = data.EVENT_TYPE_ID;
}
 