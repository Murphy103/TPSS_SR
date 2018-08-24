var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

//初始化
$(document).ready(function() {
	mini.parse();
	//生成datagrid的field
	initTableHead("subsidy_grid","REF_DEM_TYPE_PRE",true);
	
	//生成datagrid的field
	initTableHead("relsubsidy_grid","REF_DEM_TYPE_DETAIL_PRE",true);

});

/**
 * 查询补贴分类
 */
function queryData(){
	mini.parse();
	var param = {"latn_id":mini.get("LATN_ID").getValue(),
			     "ref_type":3,
				 "service_name":"REF_DEM_TYPE_SELECT"};
	
	var url = nowurl+'ControlServlet.do?serviceName=commonServlet&methodName=gridValue_rows';
	var grid = mini.get("subsidy_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 选择补贴分类关联查询补贴
 * @param e
 */
function onSelectionChanged(e) {
	
    var grid = e.sender;
    var record = grid.getSelected();
    if (record) {
    	querySubsidy(record.REF_DEM_TYPE_ID);
    }
}

/**
 * 根据补贴分类查询关联补贴
 * @param REF_DEM_TYPE_ID
 */
function querySubsidy(REF_DEM_TYPE_ID){
	mini.parse();
	var param = {"ref_dem_type_id":REF_DEM_TYPE_ID ,
			     "ref_type":3,
				 "service_name":"REF_DEM_TYPE_DETAIL_PRE"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("relsubsidy_grid");
	grid.setUrl(url);
	grid.load(param);
}



/**
 * 添加补贴分类
 */
function addSubsidy() {		
   
	var addObj = new Object();
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_A';
	
	showAddDialog("分类配置 ",400,180,Globals.baseHtmlUrl.SUBSIDY_CLASS_ADD_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}


/**
 * 修改补贴分类
 */
function modifySubsidy() {
	var rows = mini.get("subsidy_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一行修改!");
		return;
	}
	
	var modifyObj = rows[0];
	modifyObj['oper_flag'] = 'U';
	modifyObj['service_name'] = 'REF_DEM_TYPE_U';
	
	showAddDialog("补贴配置 ",400,180,Globals.baseHtmlUrl.SUBSIDY_CLASS_ADD_URL,
			function callback(data){
			
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	queryData();
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },modifyObj);
}

/**
 * 删除补贴分类
 */

function delSubsidy(){
	var rows = mini.get("subsidy_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选中一行删除!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].REF_DEM_TYPE_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	var delObj = new Object();
	delObj["REF_TYPE"] = 4;
	delObj["service_name"] = "REF_DEM_TYPE_D";
	delObj["oper_flag"] = 'D';
	delObj["REF_DEM_TYPE_ID"] = ids;
    showConfirmMessageAlter("确定删除补贴分类？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"补贴分类管理-删除补贴分类",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除补贴分类成功!");
        			queryData();
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}



/**
 * 新增关联补贴
 */
function addSubsidyRel(){
var rows = mini.get("subsidy_grid").getSelecteds();
	
	if(rows.length != 1){
		mini.alert("请选中一个补贴分类新增补贴!");
		return;
	}
	
	var addObj = rows[0];
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_DETAIL_PRE_A';
	
	showAddDialog("补贴选择 ",600,350,Globals.baseHtmlUrl.SUBSIDY_ADD_SUBSIDYREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	querySubsidy(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 导入补贴
 */
function importSubsidyRel(){
var rows = mini.get("subsidy_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一个补贴分类导入补贴!");
		return;
	}
	
	var addObj = rows[0];
	addObj['service_name'] = 'REF_DEM_TYPE_SUBSIDY_IMPORT';
	
	var serviceArr = new Array();
	var serviceObj = new Object();
	serviceObj["service_name"] = "REF_DEM_TYPE_SUBSIDY_IMPORT_PRE";
	serviceObj["oper_flag"] = "UO";
	serviceArr[0] = serviceObj;
	addObj['service_name_pre'] = serviceArr;
	
	showAddDialog("补贴导入 ",600,180,Globals.baseHtmlUrl.SUBSIDY_IMPORT_SUBSIDYREL_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("导入补贴成功!");
	            	querySubsidy(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 删除补贴
 */
function delSubsidyRel(){
var rows = mini.get("relsubsidy_grid").getSelecteds();
	
	if(rows.length == 0){
		mini.alert("请至少选择一个关联补贴删除!");
		return;
	}
	
	//选中的套餐分类
	var class_row = mini.get("subsidy_grid").getSelected();

	var ids = new Array();
	for(var i = 0;i < rows.length;i++){
		ids[i] = rows[i].PRE_RULE_ID;
	}
	var delObj = new Object();
	delObj["service_name"] = "REF_DEM_TYPE_DETAIL_PRE_D";
	delObj["oper_flag"] = 'D';
	delObj["PRE_RULE_ID"] = ids;
	delObj["REF_DEM_TYPE_ID"] = class_row["REF_DEM_TYPE_ID"];
	
    showConfirmMessageAlter("确定删除关联补贴？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"补贴分类管理-删除关联补贴",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除关联补贴成功!");
        			querySubsidy(class_row["REF_DEM_TYPE_ID"]);
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}


/**
 * 导出补贴
 */
function exportSubsidyRel(){
	mini.parse();
	var rows = mini.get("subsidy_grid").getSelecteds();

	if(rows.length != 1){
		mini.alert("请选中一个补贴分类导出关联补贴!");
		return;
	}
	
	var grid = mini.get("relsubsidy_grid");
	var params=new Object();
	params["service_name"]="REF_DEM_TYPE_DETAIL_PRE_E";
	params["file_name"]=rows[0]["REF_DEM_TYPE_NAME"]+"关联补贴";
	params["ref_dem_type_id"]=rows[0]["REF_DEM_TYPE_ID"];
	params["ref_type"]=3;
	exportExcel(params);
}
