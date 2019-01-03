package com.lk.mappers;

import java.util.List;

import com.lk.db.MessageApprovalInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 18:35:08 root
  *  
* */

public interface MessageApprovalInfoMapper
{
	// 查询表内所有数据
	public List<MessageApprovalInfo> findexpenditurePage(MessageApprovalInfo row);

	// 自定义查询表内数据
	public List<MessageApprovalInfo> customQuery(MessageApprovalInfo row);

	// 按条件查询
	public List<MessageApprovalInfo> conditionalQuery(MessageApprovalInfo row);

	// 批量删除
	public int del(MessageApprovalInfo row);

	// 新增数据
	public int add(MessageApprovalInfo row);

	// 更新数据
	public int update(MessageApprovalInfo row);
}
