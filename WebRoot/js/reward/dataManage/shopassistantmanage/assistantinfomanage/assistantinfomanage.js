	
var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
$(function(){
	mini.parse();
	var grid = mini.get("assistantinfo_datagrid");
	initTableHead(grid,"ASSISTANT_INFO_QUERY_PAGE",true);
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=getTreeSelect&service_name=CHL_TREE';
	var privilege = mini.get("PRIVILEGE");
	privilege.load(url);
	getCurPrivilegeCode("privilegeCode");
	
	mini.get("#OPERATORS_NAME").setEnabled(false);
	mini.get("#CHANNEL_NAME").setEnabled(false);
	
	initBubbton();
})

  function initBubbton(){
	  var privilegeCode=$("#privilegeCode").val();
	  if(hasButtonPrivilige(privilegeCode,"199040101")){
		   $("#deleteBtn").show();
		   $("#exportBtn").show();
		}else{
		  $("#deleteBtn").hide();
		  $("#exportBtn").hide();
		}
}
function query(){
if(mini.get("PRIVILEGE").getValue()=='' || mini.get("PRIVILEGE").getValue()==null){
	showWarnMessageAlter("渠道大小类为必选项!");
	return;
}
mini.parse();
var grid = mini.get("assistantinfo_datagrid");
var param = {
		"STAFF_ID":mini.get("STAFF_ID").getValue(),
		"STAFF_NAME":mini.get("STAFF_NAME").getValue(),
		"YZF_ACCOUNT":mini.get("YZF_ACCOUNT").getValue(),
		"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
		"OPERATORS_NAME":$("#channelCode").val(),
		"CHANNEL_NAME":$("#agentCode").val(),
		 "service_name":"SALE_STAFF_Q"
		};
var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	grid.setUrl(url);
	grid.load(param);
}

/**
 * 选择归属代理商
 */
function selectagent(){
	var channelCode=mini.get("PRIVILEGE").getValue();
	var url =nowurl+"html/reward/dataManage/shopassistantmanage/assistantinfomanage/select-agent.html?channelCode="+channelCode;
	showAddDialog("归属代理商",890,550,url,
	        function destroy(data){
				if(data !="close" && data !=null){
					mini.get("OPERATORS_NAME").setValue(data.agentName);
					$("#agentCode").val(data.agentCode);
					$("#agentId").val(data.agentId);
				}
				
	    });
}

function clearagent(){
	mini.get("OPERATORS_NAME").setValue('');
	$("#agentCode").val('');
	$("#agentId").val('');
}

function clearchannel(){
	mini.get("CHANNEL_NAME").setValue('');
	$("#channelCode").val('');
}

function exportfile(){
	mini.parse();
	var param = {
			"STAFF_ID":mini.get("STAFF_ID").getValue(),
			"STAFF_NAME":mini.get("STAFF_NAME").getValue(),
			"YZF_ACCOUNT":mini.get("YZF_ACCOUNT").getValue(),
			"PRIVILEGE":mini.get("PRIVILEGE").getValue(),
			"OPERATORS_NAME":$("#channelCode").val(),
			"CHANNEL_NAME":$("#agentCode").val(),
			 "service_name":"SALE_STAFF_EX",
			 "file_name":"店员信息管理"
			};
	
	exportExcel(param);
}


/**
 * 选择归属门店
 */
function selectchannel(){
	var url =nowurl+"html/reward/dataManage/shopassistantmanage/assistantinfomanage/select-channel.html?agentId="+$("#agentId").val();
	showAddDialog("归属门店",890,550,url,
	        function destroy(data){
				if(data !="close" && data !=null){
					mini.get("CHANNEL_NAME").setValue(data.channelName);
					$("#channelCode").val(data.channelCode);
				}
				
	    });
}



function modify() {
	mini.parse();
	var grid = mini.get("assistantinfo_datagrid");
	var rows = grid.getSelected();
	if(rows){
	mini.open({
	    url: bootPATH + "../../html/reward/dataManage/shopassistantmanage/assistantinfomanage/assistantinfo-modify.html",
	    title: "修改", width: 400, height: 450,
	    onload: function () {
	        var iframe = this.getIFrameEl();
	        var data = { action: "modify",
	        		STAFF_NAME:rows.STAFF_NAME,
	        		YZF_ACCOUNT:rows.YZF_ACCOUNT,
	        		STAFF_ID:rows.STAFF_ID,
	        		BUSI_CODE:rows.BUSI_CODE,
	        		BUSI_NAME:rows.BUSI_NAME,
	        		CHANNEL_ID:rows.CHANNEL_ID,
	        		CHANNEL_NAME:rows.CHANNEL_NAME,
	        		STATE:rows.STATUS_CD
	        }
	        iframe.contentWindow.SetData(data);
	    },
	    ondestroy: function (action) {
	        grid.reload();
	    }
	});
	}else{
		mini.alert("请选中一行");
	}
	
}
/**
 * 删除发送批次
 */
function delAssistantinfo(){
	var rows = mini.get("assistantinfo_datagrid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请选中一行进行删除!");
		return;
	}

	var params = new Object();
	params["STAFF_ID"] = rows[0].STAFF_ID;
	params["service_name"] = "SALE_STAFF_D_CHECK";
	params["oper_flag"] = 'Q';
	
	 getJsonDataByPost(Globals.baseActionUrl.SELECT_GRID_URL,params,"删除店员信息",
	            function(result){
	        			var cnt = result[0].CNT;
	        			if(cnt >0 ){
	        				mini.alert("当前店员已经存在奖励信息不能删除!");
	        			}else{
	        				params["service_name"] = "SALE_STAFF_D";
	        				params["oper_flag"] = 'D';
	        				showConfirmMessageAlter("确定删除对应店员信息？",function ok(){
	        				        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,params,"删除报帐批次",
	        				            function(result){
	        				        		if (result.success == systemVar.SUCCESS) {
	        				        			showMessageAlter("删除店员信息成功!");
	        				        			query();
	        					            }
	        				        		else{
	        				        			showErrorMessageAlter(result.errormsg);
	        				    			}
	        				            },null);
	        				    });
	        			}
	 },null);
	
}

function importfile(){
		var addObj = new Object();
		addObj['service_name'] = 'REF_DEM_TYPE_SALE_STAFF_IMPORT';
		
		var serviceArr = new Array();
		var serviceObj = new Object();
		serviceObj["service_name"] = "REF_DEM_TYPE_SALE_STAFF_IMPORT_PRE";
		serviceObj["oper_flag"] = "D";
		serviceArr[0] = serviceObj;
		//addObj['service_name_pre'] =serviceArr;
		addObj['service_name_pre'] ="";
		
		showAddDialog("文件导入 ",600,180,Globals.baseHtmlUrl.ASSISTANT_INFO_IMPORT_DYREL_URL,
				function callback(data){
		            if (data != undefined && data.success == systemVar.SUCCESS) {
		            	showMessageAlter("导入成功!");
		            	//querySales(addObj["REF_DEM_TYPE_ID"]);
		            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
		            	
		            }else{
		            	showErrorMessageAlter(data.errormsg);
		                return false;
		            }
		    },addObj);
}