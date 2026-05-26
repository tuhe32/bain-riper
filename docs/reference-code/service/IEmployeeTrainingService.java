package com.reference.service;

import com.reference.domain.bo.EmployeeTrainingBo;
import com.reference.domain.vo.EmployeeTrainingVo;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;

import java.util.Collection;
import java.util.List;

/**
 * 员工培训档案Service接口
 *
 * @author LiuBin
 * @date 2025-12-07
 */
public interface IEmployeeTrainingService {

    /**
     * 查询员工培训档案
     *
     * @param id 主键
     * @return 员工培训档案
     */
    EmployeeTrainingVo queryById(Long id);

    /**
     * 分页查询员工培训档案列表
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 员工培训档案分页列表
     */
    TableDataInfo<EmployeeTrainingVo> queryPageList(EmployeeTrainingBo bo, PageQuery pageQuery);

    /**
     * 查询符合条件的员工培训档案列表
     *
     * @param bo 查询条件
     * @return 员工培训档案列表
     */
    List<EmployeeTrainingVo> queryList(EmployeeTrainingBo bo);

    /**
     * 新增员工培训档案
     *
     * @param bo 员工培训档案
     * @return 是否新增成功
     */
    Boolean insertByBo(EmployeeTrainingBo bo);

    /**
     * 修改员工培训档案
     *
     * @param bo 员工培训档案
     * @return 是否修改成功
     */
    Boolean updateByBo(EmployeeTrainingBo bo);

    /**
     * 校验并批量删除员工培训档案信息
     *
     * @param ids     待删除的主键集合
     * @param isValid 是否进行有效性校验
     * @return 是否删除成功
     */
    Boolean deleteWithValidByIds(Collection<Long> ids, Boolean isValid);

}
