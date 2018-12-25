package com.lk.mappers;

import java.util.List;

import com.lk.db.OrderInfo;

public interface OrderMapper
{
	// 添加数据
	public int add(OrderInfo row);

	// 查询表内所有数据
	public List<OrderInfo> findexpenditurePage(OrderInfo row);

	// 自定义查询表内数据
	public List<OrderInfo> customQuery(OrderInfo row);

	// 根据特定条件查询表内数据
	public List<OrderInfo> conditionalQuery(OrderInfo row);

	// 根据订单号查询规格型号详情
	public List<OrderInfo> queryModelDetails(OrderInfo row);
	
	//客户对账查询需要的数据
	public List<OrderInfo> uniqueQuery(OrderInfo row);
	
	// 根据订单号查询当前订单号下所有字段
	public List<OrderInfo> queryNowOrderInfo(OrderInfo row);

	// 根据id查询当前订单下的所有规格
	public List<OrderInfo> findModelById(OrderInfo row);

	// 根据 id,客户名称,操作人,订单号查询 当前订单下:总数量,总面积
	public List<OrderInfo> accurateFind(OrderInfo row);

	// 更新数据
	public int update(OrderInfo row);

	// 删除数据
	public int del(OrderInfo row);

	// 模糊查询
	public List<OrderInfo> Gluestudy(String basicStandard);
}
