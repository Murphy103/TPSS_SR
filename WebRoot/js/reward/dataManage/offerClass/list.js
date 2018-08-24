var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));

//初始化
$(document).ready(function() {
	mini.parse();
	
	//生成datagrid的field
	initTableHead("class_grid","REF_DEM_TYPE_SELECT",true);
	
	//生成datagrid的field
	initTableHead("offer_rel_grid","REF_DEM_TYPE_OFR_SELECT",true);
	

});

/**
 * 查询套餐分类
 */
function queryData(){
	mini.parse();
	var param = {"latn_id":mini.get("LATN_ID").getValue(),
				 "ref_type":1,
				 "service_name":"REF_DEM_TYPE_SELECT"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("class_grid");
	grid.setUrl(url);
	grid.load(param);

}

/**
 * 选择套餐分类关联查询套餐
 * @param e
 */
function onSelectionChanged(e) {
	
    var grid = e.sender;
    var record = grid.getSelected();
	if (record) {
		queryOffer(record.REF_DEM_TYPE_ID);
	}
    
}

/**
 * 根据套餐分类查询关联套餐
 * @param REF_DEM_TYPE_ID
 */
function queryOffer(REF_DEM_TYPE_ID){
	mini.parse();
	var param = {"ref_dem_type_id":REF_DEM_TYPE_ID ,
				 "service_name":"REF_DEM_TYPE_OFR_SELECT"};
	
	var url = Globals.baseActionUrl.SELECT_OPERATION_URL;
	var grid = mini.get("offer_rel_grid");
	grid.setUrl(url);
	grid.load(param);
}

/**
 * 添加套餐分类
 */
function addClass() {		
   
	var addObj = new Object();
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_INSERT';
	
	showAddDialog("分类配置 ",400,180,Globals.baseHtmlUrl.OFFER_CLASS_ADD_URL,
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
 * 修改套餐分类
 */
function modifyClass() {
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一行修改!");
		return;
	}
	
	var modifyObj = rows[0];
	modifyObj['oper_flag'] = 'U';
	modifyObj['service_name'] = 'REF_DEM_TYPE_UPDATE';
	
	showAddDialog("分类配置 ",400,180,Globals.baseHtmlUrl.OFFER_CLASS_ADD_URL,
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
 * 删除套餐分类
 */
function delClass(){
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一个套餐分类删除!");
		return;
	}
	
	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].REF_DEM_TYPE_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var delObj = new Object();
	delObj["REF_TYPE"] = 1;
	delObj["service_name"] = "REF_DEM_TYPE_DELETE";
	delObj["oper_flag"] = 'D';
	delObj["REF_DEM_TYPE_ID"] = ids;
	
    showConfirmMessageAlter("确定删除套餐分类？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"套餐分类管理-删除套餐分类",
            function(result){
        	
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除套餐分类成功!");
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
 * 新增套餐
 */
function addOffer(){
	
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一个套餐分类新增套餐!");
		return;
	}
	
	var addObj = rows[0];
	addObj['oper_flag'] = 'A';
	addObj['service_name'] = 'REF_DEM_TYPE_OFR_INSERT';
	
	showAddDialog("套餐选择 ",600,400,Globals.baseHtmlUrl.OFFER_CLASS_ADD_OFFER_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("新增套餐成功!");
	            	queryOffer(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 导入套餐
 */
function importOffer(){
	var rows = mini.get("class_grid").getSelecteds();
	
	if(rows.length != 1){
		showErrorMessageAlter("请选中一个套餐分类导入套餐!");
		return;
	}
	
	var addObj = rows[0];
	addObj['service_name'] = 'REF_DEM_TYPE_OFR_IMPORT';
	
	var serviceArr = new Array();
	var serviceObj = new Object();
	serviceObj["service_name"] = "REF_DEM_TYPE_OFR_IMPORT_PRE";
	serviceObj["oper_flag"] = "UO";
	serviceArr[0] = serviceObj;
	addObj['service_name_pre'] = serviceArr;
	
	showAddDialog("套餐导入 ",600,200,Globals.baseHtmlUrl.OFFER_CLASS_IMPORT_OFFER_URL,
			function callback(data){
	            if (data != undefined && data.success == systemVar.SUCCESS) {
	            	showMessageAlter("导入套餐成功!");
	            	queryOffer(addObj["REF_DEM_TYPE_ID"]);
	            }else if(data == systemVar.CANCEL || data == systemVar.CLOSE){
	            	
	            }else{
	            	showErrorMessageAlter(data.errormsg);
	                return false;
	            }
	    },addObj);
}

/**
 * 删除套餐
 */
function delOffer(){
	var rows = mini.get("offer_rel_grid").getSelecteds();
	
	if(rows.length == 0){
		showErrorMessageAlter("请至少选择一个关联套餐删除!");
		return;
	}
	
	//选中的套餐分类
	var class_row = mini.get("class_grid").getSelected();

	var ids = "";
	for(var i = 0;i < rows.length;i++){
		ids += rows[i].OFFER_ID + ",";
	}
	ids = ids.substring(0,ids.length-1);
	
	var delObj = new Object();
	delObj["service_name"] = "REF_DEM_TYPE_OFR_DELETE";
	delObj["oper_flag"] = 'D';
	delObj["OFR_ID"] = ids;
	delObj["REF_DEM_TYPE_ID"] = class_row["REF_DEM_TYPE_ID"];
	
    showConfirmMessageAlter("确定删除关联套餐？",function ok(){
        getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,delObj,"套餐分类管理-删除关联套餐",
            function(result){
        		if (result.success == systemVar.SUCCESS) {
            		
        			showMessageAlter("删除关联套餐成功!");
        			queryOffer(class_row["REF_DEM_TYPE_ID"]);
	            }
        		else
    			{
        			showErrorMessageAlter(result.errormsg);
    			}
            },null);
    });
}


/**
 * 导出套餐
 */
function exportOffer(){
	
	mini.parse();
	var rows = mini.get("class_grid").getSelecteds();

	if(rows.length != 1){
		showErrorMessageAlter("请选中一个套餐分类导出关联套餐!");
		return;
	}
	
	var grid = mini.get("offer_rel_grid");
	var params = new Object();
	params["service_name"] = "REF_DEM_TYPE_OFR_EXPORT";
	params["file_name"] = rows[0]["REF_DEM_TYPE_NAME"]+"关联套餐";
	params["ref_dem_type_id"] = rows[0]["REF_DEM_TYPE_ID"];
	
	exportExcel(params);
	
}

