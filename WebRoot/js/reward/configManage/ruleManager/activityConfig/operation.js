var JsVar = new Object();

//初始化
$(document).ready(function() {
	mini.parse();
	JsVar["activityForm"] = new mini.Form("#activity_form");
	JsVar["enabled"] = "true";
	
	//获取规则条件下拉选项
	JsVar["LEFTFORMULA"] = getData('LEFTFORMULA');
	JsVar["OPERATOR"] = getData('TB_PTY_CODE_Q',false,'OPERATOR');
	JsVar["RIGHTTIP"] = getData('RIGHTTIP');
	
	JsVar["CHANNEL_TYPE"] = getData('TB_PTY_CODE_Q',false,'CHANNEL_TYPE_CD');
	JsVar["REF_DEM_TYPE"] = getData('REF_DEM_TYPE',false);
	
	//根据选择的对象类型，切换对象下拉值
	var objectType = mini.get("OBJECT_TYPE");
	mini.get("OBJECT_ID").setData(JsVar["CHANNEL_TYPE"]);
    objectType.on("valuechanged", function (e) {
        
        if(this.getValue() == '4'){
        	$("#OBJECT_LABEL").html("门店类型");
        	mini.get("OBJECT_ID").setData(JsVar["CHANNEL_TYPE"]);
        }else{
        	$("#OBJECT_LABEL").html("店员分组");
        	mini.get("OBJECT_ID").setData(JsVar["REF_DEM_TYPE"]);
        }
    });
    
    //设置生效时间为当前月的第一天
    var firstDate=new Date();
    firstDate.setDate(1);
    
    mini.get("EFF_DATE").setValue(firstDate);
    
    //设置失效时间为当前月加两个月的最后一天
    var lastDate=new Date();
    lastDate.setMonth(lastDate.getMonth()+3);
    lastDate.setDate(0);
    mini.get("EXP_DATE").setValue(lastDate);
	
	//当前活动关联的规则索引
	JsVar["RULE"] = new Array();
	JsVar["RULENUM"] = 0;
	//规则关联的规则条件索引
	JsVar["RULE_CONDITION"] = new Object();
	JsVar["RULE_CONDITION_NUM"] = new Object();
	
	//查看明细
	if(Globals.action != undefined && Globals.action == "detail"){
		JsVar["enabled"] = "false";
		mini.get("add-rule").setEnabled(false);
		mini.get("add-activity").setEnabled(false);
		
		var data = {"ACTIVITY_ID":Globals.activity_id,
				"ACTIVITY_NAME":Globals.activity_name};
		onLoadComplete(Globals.action,data); 
	}
	
	
});

/**
 * 限制生效时间不能选择晚于失效时间
 * @param e
 */
function onDrawEffDate(e) {
    var date = e.date;
    var expDate = mini.get("EXP_DATE").getValue();

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
    var effDate = mini.get("EFF_DATE").getValue();

    if (date.getTime() < effDate.getTime()) {
        e.allowSelect = false;
    }
}

/**
 * 添加活动规则
 */
function onAddRule(){
	var length = JsVar["RULE"].length;
	if(length == 0){
		JsVar["RULE"][length] = 1;
	}else{
		JsVar["RULE"][length] = JsVar["RULE"][length-1] + 1;
	}
		
	length = JsVar["RULE"].length;
	var index = JsVar["RULE"][length-1];
	var num = ++JsVar["RULENUM"];
	
	var content = "<div class=\"mini-fit\" style=\"margin-top: 5px;\" id=\"rule_form_label_"+index+"\">  "; 
	content+= "	    	<div style=\"width: 100%;\">";
	content+= "	        <div class=\"search\" style=\"height: 30px;\">";
	content+= "	        	<b>规则"+num+"</b>";
	content+= "	        	<a class=\"mini-button fr\" onclick=\"onDelRule("+index+")\" enabled=\""+JsVar["enabled"]+"\">删除</a> ";
	content+= "	        </div>";
	content+= "	    </div>";
	content+= "	</div> ";
		 
	content+= "<table id=\"rule_form_"+index+"\" class=\"formTable6\" style=\"table-layout: fixed;\">";
	content+= "		<tr>";
	content+= "			<th><span class=\"fred\">*</span>规则名称：</th>";
	content+= "			<td colspan=\"2\"><input id=\"RULE_NAME"+index+"\" name=\"RULE_NAME"+index+"\" class=\"mini-textbox ml5\" style=\"width:80%;\" required=\"true\" />  </td>";
	content+= "			<th><span class=\"fred\">*</span>奖励金额：</th>";
	content+= "			<td colspan=\"2\"><input id=\"CHARGE"+index+"\" name=\"CHARGE"+index+"\" vtype=\"int\" class=\"mini-textbox ml5\" style=\"width:80%;\" required=\"true\" />  </td>";
	content+= "		</tr>";
	content+= "		<tr>";
	content+= "			<td colspan=\"6\">";
	content+= "				<div style=\"margin-top: 5px;\" >  "; 
	content+= "				    <div style=\"width: 100%;\">";
	content+= "				        <div class=\"search\" style=\"height: 30px;background-color:white;\">";
	content+= "				        	<b>限制条件</b>";
	content+= "				        	<a class=\"mini-button opBtn fr\" onclick=\"onAddCondition("+index+")\" enabled=\""+JsVar["enabled"]+"\">新增</a> ";
	content+= "				        </div>";
	content+= "				    </div>";
	content+= "				</div> ";
	content+= "		        <table id=\"condition_form_"+index+"\" class=\"formTable6\" style=\"table-layout: fixed;\">";
	content+= "				</table> ";
	content+= "			</td>";
	content+= "		</tr>";
	content+= "</table>";
	
	$("#add_edit").append(content);
	mini.parse();
}

/**
 * 删除活动规则
 */
function onDelRule(index){
	$("#rule_form_label_"+index).remove();
	$("#rule_form_"+index).remove();
	
	//删除指定规则
	$.each(JsVar["RULE"], function(i, value) {
	   if(value == index){
		   delete(JsVar["RULE"][i]);
	   }
	});
	JsVar["RULENUM"]--;
	
	//给规则label重新命名
	$("#add_edit").children("div").find("b").each(function(i,element){
		//去掉活动信息下的<b>标签
		if(i != 0){
			$(this).html("规则"+i+"：");
		}
		
	});
	
	delete(JsVar["RULE_CONDITION"][index]);
}

/**
 * 选中规则条件左值时触发
 * @param e
 */
function onSelectLeftFormula(pre_fix){

	var left = mini.get("LEFTFORMULA"+pre_fix).getValue();
	mini.get("RIGHT_VALUE"+pre_fix).setValue("");
	
	$.each(JsVar["RIGHTTIP"],function(index,value){
		
		if(value["id"] == left){
			mini.get("RIGHT_VALUE"+pre_fix).setEmptyText(value["text"]);
			return;
		}
	});
	
}

/**
 * 增加规则条件
 */
function onAddCondition(index){
	var condition_num = 0;
	var condition_index = 0;
	
	if(JsVar["RULE_CONDITION"][index] == undefined){
		JsVar["RULE_CONDITION"][index] = new Array();
		//规则条件索引
		JsVar["RULE_CONDITION"][index][0] = 1;
		JsVar["RULE_CONDITION_NUM"][index] = 1;
		condition_num = 1;
		condition_index = 1;
	}else{
		//规则条件索引为最大的索引+1
		var length = JsVar["RULE_CONDITION"][index].length;
		JsVar["RULE_CONDITION"][index][length] = JsVar["RULE_CONDITION"][index][length-1]+1;
		
		condition_num = ++JsVar["RULE_CONDITION_NUM"][index];
		condition_index = JsVar["RULE_CONDITION"][index][JsVar["RULE_CONDITION"][index].length-1];
	}
	
	
	
	
	var pre_fix = "_"+index+"_"+condition_index;
	
	var condition = "<tr id=\"condition"+pre_fix+"\">";
	condition += "<th><span class=\"fred\">*</span>限制条件"+condition_num+"：</th>";
	condition += "<td colspan=\"2\"><input id=\"LEFTFORMULA"+pre_fix+"\" name=\"LEFTFORMULA"+pre_fix+"\" class=\"mini-combobox ml5\" style=\"width:70%;\"";
	condition += "required=\"true\" onvaluechanged=\"onSelectLeftFormula('"+pre_fix+"')\"/> </td>";
	condition += "<td ><input id=\"OPERATOR"+pre_fix+"\" name=\"OPERATOR"+pre_fix+"\" class=\"mini-combobox ml5\" style=\"width:80%;\"";
	condition += "required=\"true\" /> </td>";
	condition += "<td colspan=\"2\"><input id=\"RIGHT_VALUE"+pre_fix+"\" name=\"RIGHT_VALUE"+pre_fix+"\" class=\"mini-textbox ml5\" ";
	condition += "style=\"width:70%;\" required=\"true\" /> <a class=\"mini-button fr\" onclick=\"onDelCondition("+index+","+condition_index+")\" enabled=\""+JsVar["enabled"]+"\">-</a>  </td>  "	;	
	condition += "</tr>";
	
	
	$("#condition_form_"+index).append(condition);
	mini.parse();
	mini.get("LEFTFORMULA"+pre_fix).setData(JsVar["LEFTFORMULA"]);
	mini.get("OPERATOR"+pre_fix).setData(JsVar["OPERATOR"]);
}

/**
 * 删除规则条件
 */
function onDelCondition(index,condition_index){
	$("#condition_"+index+"_"+condition_index).remove();
	
	//删除指定规则
	$.each(JsVar["RULE_CONDITION"][index], function(i, value) {
	   if(value == condition_index){
		   delete(JsVar["RULE_CONDITION"][index][i]);
	   }
	});
	
	JsVar["RULE_CONDITION_NUM"][index]--;
	
	//给规则条件label重新命名
	$("#condition_form_"+index).find("th").each(function(i,element){
		$(this).html("<span class=\"fred\">*</span>限制条件"+(i+1)+"：");
	});
	
}

/**
 * 父窗口调用的初始化方法
 * @param action 操作类型
 * @param data   参数
 */
function onLoadComplete(action,data) {
  
	JsVar["data"] = new Object();
	JsVar["data"]["action"] = action;
	if(action == "detail" || action == "edit"){
		
		getJsonDataByPost(Globals.baseActionUrl.RULE_DETAIL_URL,data,"查询活动详细",
		        function(result){
					if(result.success != systemVar.SUCCESS){
						showErrorMessageAlter(result.errormsg);
						JsVar["activityForm"].setEnabled(false);
						mini.get("add-rule").setEnabled(false);
						mini.get("add-activity").setEnabled(false);
		                return false;
					}
	    			var obj = result.data;
	    			
	    			//活动ID、策略ID、定价计划ID传入后台用于更新
	    			JsVar["data"]["OFFER_ID"] = data["ACTIVITY_ID"];
	    			JsVar["data"]["PRICING_STRATEGY_ID"] = data["PRICING_STRATEGY_ID"];
	    			JsVar["data"]["PRICING_PLAN_ID"] = data["PRICING_PLAN_ID"];
	    			
	    			if(obj["OBJECT_TYPE"] == '5'){
	    				$("#OBJECT_LABEL").html("店员分组");
	    	        	mini.get("OBJECT_ID").setData(JsVar["REF_DEM_TYPE"]);
	    			}
	    			
	    			JsVar["activityForm"].setData(obj,false);
	    			JsVar["activityForm"].setEnabled(action=="detail"?false:true);
	    			
	    			var index = 0;
	    			//开始解析规则
	    			if(obj["RULE_INFO"] != undefined){
	    				$.each(obj["RULE_INFO"],function(key,value){
		    				index++;
		    				//添加规则
		    				onAddRule();
		    				mini.get("RULE_NAME"+index).setValue(value["RULE_NAME"]);
		    				mini.get("CHARGE"+index).setValue(value["CHARGE"]);
		    				
		    				JsVar["rule_form_"+index] = new mini.Form("#rule_form_"+index);
		    				JsVar["rule_form_"+index].setEnabled(action=="detail"?false:true);
		    				
		    				if(value["CONDITION"] != undefined){
		    					//添加规则条件
		    					$.each(value["CONDITION"],function(conditionIndex,condition){
		    						onAddCondition(index);
		    						
		    						var pre_fix = "_"+index+"_"+(conditionIndex+1);
		    						
		    						mini.get("LEFTFORMULA"+pre_fix).setValue(condition["LEFTFORMULA"]);
				    				mini.get("OPERATOR"+pre_fix).setValue(condition["OPERATOR"]);
				    				mini.get("RIGHT_VALUE"+pre_fix).setValue(condition["RIGHT_VALUE"]);
				    				
		    					});
		    					
		    					JsVar["condition_form_"+index] = new mini.Form("#condition_form_"+index);
			    				JsVar["condition_form_"+index].setEnabled(action=="detail"?false:true);
		    				}
		    				
		    			});
	    			}
	    			
		        });
	}
	
	   
    
}



/**
 * 保存套餐分类
 */
function onSubmit() {
    JsVar["activityForm"].validate();
    if (JsVar["activityForm"].isValid() == false){
        return;
    }
    
    //获取活动信息
     var activityInfo = JsVar["activityForm"].getData();
    $.extend(activityInfo, JsVar["data"]);
    //获取规则信息
    var ruleInfo = new Array();
    var validFlag = true;
    
    activityInfo["EFF_DATE"] = mini.get("EFF_DATE").getFormValue();
    activityInfo["EXP_DATE"] = mini.get("EXP_DATE").getFormValue();
        
    //获取规则
    $.each(JsVar["RULE"], function(i, ruleIndex) {
    	if(ruleIndex != undefined){
    	
	    	JsVar["rule_form"] = new mini.Form("#rule_form_"+ruleIndex);
	    	
	    	JsVar["rule_form"].validate();
	    	if (JsVar["rule_form"].isValid() == false){
	    		validFlag = false;
	    	    return;
	    	}
	    	
	    	//规则信息
	    	ruleInfo[i] = new Object();
	    	ruleInfo[i]["RULE_NAME"] = mini.get("RULE_NAME"+ruleIndex).getValue();
	    	ruleInfo[i]["CHARGE"] = mini.get("CHARGE"+ruleIndex).getValue();
	    	
	    	//有规则条件
	    	if(JsVar["RULE_CONDITION"][ruleIndex] != undefined){
		    	//规则条件校验
		    	JsVar["condition_form"] = new mini.Form("#condition_form_"+ruleIndex);
		    	
		   	 	JsVar["condition_form"].validate();
		   	 	if (JsVar["condition_form"].isValid() == false){
		   	 		validFlag = false;
		   	 		return;
		   	 	}
		    	
		    	
		    	ruleInfo[i]["CONDITION"] = new Array();
		    	
		    	 $.each(JsVar["RULE_CONDITION"][ruleIndex], function(j, conditionIndex) {
		    		 if(conditionIndex != undefined){
		    			 ruleInfo[i]["CONDITION"][j] = new Object();
			    		 ruleInfo[i]["CONDITION"][j]["LEFTFORMULA"] = mini.get("LEFTFORMULA_"+ruleIndex+"_"+conditionIndex).getValue();
			    		 ruleInfo[i]["CONDITION"][j]["OPERATOR"] = mini.get("OPERATOR_"+ruleIndex+"_"+conditionIndex).getValue();
			    		 ruleInfo[i]["CONDITION"][j]["RIGHT_VALUE"] = mini.get("RIGHT_VALUE_"+ruleIndex+"_"+conditionIndex).getValue();
		    		 }
		    		 
		    	 });
	    	}
    	}
 	});
    
    if(validFlag == true){
    	activityInfo["RULEINFO"] = ruleInfo;
        
        getJsonDataByPost(Globals.baseActionUrl.RULE_OPERATION_URL,activityInfo,"规则维护",
    	        function(result){
        			activityInfo["success"] = result.success;
        			activityInfo["errormsg"] = result.errormsg;
    		        closeWindow(activityInfo);
    	        });
    }
    
    
    
   
    //检查活动名称是否重复
   /* var param = {"latn_id":activityInfo["LATN_ID"],
    		 "ref_type":1,
			 "ref_dem_type_name":classInfo["REF_DEM_TYPE_NAME"],
			 "ref_dem_type_id":JsVar["data"]["REF_DEM_TYPE_ID"],
			 "service_name":"REF_DEM_TYPE_SELECT",
			 "pageIndex":0,
			 "pageSize":6};

    getJsonDataByPost(Globals.baseActionUrl.SELECT_OPERATION_URL,param,"销售品分类名称重复校验",
	        function(result){
    			console.log(result);
    			if(result.success == systemVar.SUCCESS && result.total > 0){
    				classInfo["success"] = systemVar.FAIL;
    				classInfo["errormsg"] = "销售品分类名称重复";
    				closeWindow(classInfo);
    			}else if(result.success == systemVar.FAIL){
    				classInfo["success"] = systemVar.FAIL;
    				classInfo["errormsg"] = result.errormsg;
    				closeWindow(classInfo);
    			}else{
    				//分类类型
    			    classInfo["REF_TYPE"] = 1;
    			    classInfo["service_name"] = JsVar["data"]["service_name"];
    			    classInfo["oper_flag"] = JsVar["data"]["oper_flag"];
    			    classInfo["REF_DEM_TYPE_ID"] = JsVar["data"]["REF_DEM_TYPE_ID"];
    			        
    			    getJsonDataByPost(Globals.baseActionUrl.ACTION_OPERATION_URL,classInfo,"销售品分类维护",
    				        function(result){
    			    			classInfo["success"] = result.success;
    			    			classInfo["errormsg"] = result.errormsg;
    					        closeWindow(classInfo);
    				        });
    			}
    			
	        });
   */
   
    
    
}