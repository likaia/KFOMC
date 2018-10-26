package com.lk.mappers;

import java.util.List;

import com.lk.db.FittingInfo;
/*配件信息*/
public interface FittingInfoMapper
{
	//查询表内所有数据
		public List<FittingInfo> findexpenditurePage(FittingInfo row);
		//根据条件查询
		public List<FittingInfo> conditionalQuery(FittingInfo row);
		//根据订单号查询表内数据
		public List<FittingInfo> queryByOrderNumber(FittingInfo row);
		//删除数据
		public int del(FittingInfo row);
		//新增数据
		public int add(FittingInfo row);
		// 根据操作人查询表内 所有配件名称/配件图片
		public List<FittingInfo> getProductNameImgUrl(FittingInfo row);
}
