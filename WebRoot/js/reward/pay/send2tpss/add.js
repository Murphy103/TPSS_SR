var nowurl  = document.location.href;
nowurl = nowurl.substring(0,nowurl.indexOf("html"));
var JsVar = new Object();
//初始化
$(document).ready(function() {
	mini.parse();

	JsVar["dataForm"] = new mini.Form("#data_form");
	
	//设置生效时间为当前月的第一天
    var firstDate=new Date();
    firstDate.setDate(1);
    
    //mini.get("ADD_START_DATE").setValue(firstDate);
    
    //设置失效时间为当前月加两个月的最后一天
    var lastDate=new Date();
    
    lastDate.setMonth(lastDate.getMonth()+1);
    lastDate.setDate(0);
    //mini.get("ADD_END_DATE").setValue(lastDate);
	
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
 * 限制生效时间不能选择晚于失效时间
 * @param e
 */
function onDrawEffDate(e) {
    var date = e.date;
    var expDate = mini.get("ADD_END_DATE").getValue();

    if (date.getTime() > expDate.getTime()) {
        e.allowSelect = false;
    }
}

/**
 * 限制失效时间不能选择早于生效时间
 * @param e
 */
function onDrawExpDate(e) {
    var date = e.date;
    var effDate = mini.get("ADD_START_DATE").getValue();

    if (date.getTime() < effDate.getTime()) {
        e.allowSelect = false;
    }
}


/**
 * 保存报帐批次
 */
function onSubmit() {
    JsVar["dataForm"].validate();
    if (JsVar["dataForm"].isValid() == false){
        return;
    }
    
    //获取表单控件的数据
    var dataInfo = JsVar["dataForm"].getData();

    var effDate = mini.get("ADD_START_DATE").getValue();
    var expDate = mini.get("ADD_END_DATE").getValue();
    if((effDate==''||expDate=='')&&mini.get("BILLING_CYCLE_ID").getValue() ==''){
    	showMessageAlter("帐期和订单竣工时间区间不可同时为空!");
    	return;
    }

    if(effDate!=''&&effDate!=null&&expDate!=''&&expDate!=null){
    	if(effDate.getTime() > expDate.getTime()){
        	showMessageAlter("开始时间不能大于截至时间!");
        	return;
    	}
    }
    
    var order_id = "";//定义一个订单号
    var file_path = mini.get("file_path").getValue();
    if(file_path == null||file_path == ""){
    	 order_id = "";
    	//新增批次后台处理begin
		  var param = {"START_DATE":mini.get("ADD_START_DATE").getFormValue(),
					 "END_DATE":mini.get("ADD_END_DATE").getFormValue(),
					 "BILLING_CYCLE_ID":mini.get("BILLING_CYCLE_ID").getFormValue(),
					 "ORDER_ID":order_id};


			showLoadMask("后台处理中，请耐心等待，勿重复点击！");
		    //提交数据   
		    getJsonDataByPost(Globals.baseActionUrl.SEND_TO_TPSS_ADD,param,"新增报帐批次",
		    	function(result){
			    	dataInfo["success"] = result.success;
			    	dataInfo["errormsg"] = result.errormsg;
			    	hideLoadMask();
		    		closeWindow(dataInfo);
		    });
			//新增批次后台处理end    
    }else{//订单号不为空逻辑判断
    	//1.先删除历史数据
    	var params_d = new Object();
    	params_d["service_name"] = "SALE_REWARD_SEND2TPSS_ORDERID_D";
    	params_d["oper_flag"] = 'D';
    	getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,params_d,"删除历史订单号",
	            function(result){
	        		if (result.success == systemVar.SUCCESS) {
	        			//2.添加导入逻辑
	        		var orderInfo = new Object();
		        		orderInfo["service_name"] = "SALE_REWARD_SEND2TPSS_ORDERID_IMPORT";
		        		//orderInfo["service_name_pre"] = serviceArr;
		        		orderInfo["service_name_pre"] = "";
		        		orderInfo["file_path"] = mini.get("file_path").getValue();
		        		orderInfo["upload_flag"] = "LOCAL";
		        		orderInfo["parse_flag"] = true;
	        		    
	        		    ajaxUploadFile(Globals.baseActionUrl.IMPORT_OPERATION_URL,"file_path",orderInfo,function(result){
	        		    	result = mini.decode(result);
				        	if(result.success=='success'){
				        		//3.导入成功后获取导入的订单号
				        		var params = new Object();
				        		params["service_name"] = "SALE_REWARD_SEND2TPSS_ORDERID_Q";
				        		params["oper_flag"] = 'Q';
				        		 getJsonDataByPost(Globals.baseActionUrl.SELECT_GRID_URL,params,"获取订单号",
				        		            function(result){
				        			                debugger;
				        		        			var order_ids = result[0].ORDER_ID;
				        		        			if(order_ids !=""){
				        		        			  //新增批次后台处理begin
			        		        				  var param = {"START_DATE":mini.get("ADD_START_DATE").getFormValue(),
			        		        							 "END_DATE":mini.get("ADD_END_DATE").getFormValue(),
			        		        							 "BILLING_CYCLE_ID":mini.get("BILLING_CYCLE_ID").getFormValue(),
			        		        							 "ORDER_ID":order_ids};


			        		        					showLoadMask("后台处理中，请耐心等待，勿重复点击！");
			        		        				    //提交数据   
			        		        				    getJsonDataByPost(Globals.baseActionUrl.SEND_TO_TPSS_ADD,param,"新增报帐批次",
			        		        				    	function(result){
			        		        					    	dataInfo["success"] = result.success;
			        		        					    	dataInfo["errormsg"] = result.errormsg;
			        		        					    	hideLoadMask();
			        		        				    		closeWindow(dataInfo);
			        		        				    });
				        		        				//新增批次后台处理end    
				        		        			}else{
				        		        				showMessageAlter("没有获取到订单号，请检查订单导入临时表!");
				        		        				return;
				        		        			}
				        		 },null,null,false);
				        		//获取订单号end
				        		 }
				        		});
					            }
			        		else{
			        			showErrorMessageAlter(result.errormsg);
			        			return;
			    			}
			            },null,null,false);
    }
    //新增报账批次后台处理
//    var param = {"START_DATE":mini.get("ADD_START_DATE").getFormValue(),
//			 "END_DATE":mini.get("ADD_END_DATE").getFormValue(),
//			 "BILLING_CYCLE_ID":mini.get("BILLING_CYCLE_ID").getFormValue(),
//			 "ORDER_ID":order_id};
//
//
//	showLoadMask("后台处理中，请耐心等待，勿重复点击！");
//    //提交数据   
//    getJsonDataByPost(Globals.baseActionUrl.SEND_TO_TPSS_ADD,param,"新增报帐批次",
//    	function(result){
//	    	dataInfo["success"] = result.success;
//	    	dataInfo["errormsg"] = result.errormsg;
//	    	hideLoadMask();
//    		closeWindow(dataInfo);
//    });
//    
}
