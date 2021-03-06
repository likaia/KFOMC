package com.lk.mappers;

import java.util.List;

import com.lk.db.User;

public interface UserMapper
{
	public int add(User user);
	//更新一条记录
	public int update(User user);
	//更新范围区间
	public int updateRange(User user);
	//更新公司考勤信息
	public int updateAttendanceInfo(User row);
	//通过id删除
	public int delete(Integer id);
	//自定义查询
	public List<User> customQuery(User row);
	//通过姓名手机号查找
	public  List<User> findCellphoneByUser(User row);
	//通过姓名查找
	public User findByName(String userName);
	//查询全部用户
	public List<User> find();	
	//从数据库取出图片
	public User getBlobByName(String userName);
}
