package com.reference.mapper;

import com.reference.domain.EmployeeTraining;
import com.reference.domain.vo.EmployeeTrainingVo;
import org.apache.ibatis.annotations.Mapper;
import org.dromara.common.mybatis.core.mapper.BaseMapperPlus;

/**
 * 员工培训档案Mapper接口
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Mapper
public interface EmployeeTrainingMapper extends BaseMapperPlus<EmployeeTraining, EmployeeTrainingVo> {

}
