package com.lk.mappers;

import java.util.List;

import com.lk.db.ClientInfo;


/*
  * 
  *  @author  李凯
  *  @version V-2018-11-01 16:49:25 root
  *  
* */

public interface ClientInfoMapper
{
	//查询表内所有数据
	public List<ClientInfo> findexpenditurePage(ClientInfo row);
	//自定义查询
	public List<ClientInfo> conditionalQuery(ClientInfo row);
	//批量删除
	public int del(ClientInfo row);
	//新增数据
	public int add(ClientInfo row);
	//更新数据
	public int update(ClientInfo row);
}
