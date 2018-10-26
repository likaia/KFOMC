package com.lk.mappers;

import java.util.List;

import com.lk.db.User;

public interface UserMapper
{
	public int add(User user);
	//更新一条记录
	public int update(User user);
	//通过id删除
	public int delete(Integer id);
	//通过姓名手机号查找
	public  List<User> findCellphoneByUser(User row);
	//通过姓名查找
	public User findByName(String userName);
	//查询全部用户
	public List<User> find();	
	//从数据库取出图片
	public User getBlobByName(String userName);
}
