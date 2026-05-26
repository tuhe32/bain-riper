package com.reference.service.impl;

import com.reference.domain.EmployeeTraining;
import com.reference.domain.bo.EmployeeTrainingBo;
import com.reference.domain.vo.EmployeeTrainingVo;
import com.reference.mapper.EmployeeTrainingMapper;
import com.reference.service.IEmployeeTrainingService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.dromara.common.core.utils.MapstructUtils;
import org.dromara.common.core.utils.StringUtils;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * 员工培训档案Service业务层处理
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class EmployeeTrainingServiceImpl implements IEmployeeTrainingService {

    private final EmployeeTrainingMapper baseMapper;

    /**
     * 查询员工培训档案
     *
     * @param id 主键
     * @return 员工培训档案
     */
    @Override
    public EmployeeTrainingVo queryById(Long id) {
        return baseMapper.selectVoById(id);
    }

    /**
     * 分页查询员工培训档案列表
     *
     * @param bo        查询条件
     * @param pageQuery 分页参数
     * @return 员工培训档案分页列表
     */
    @Override
    public TableDataInfo<EmployeeTrainingVo> queryPageList(EmployeeTrainingBo bo, PageQuery pageQuery) {
        LambdaQueryWrapper<EmployeeTraining> lqw = buildQueryWrapper(bo);
        Page<EmployeeTrainingVo> result = baseMapper.selectVoPage(pageQuery.build(), lqw);
        return TableDataInfo.build(result);
    }

    /**
     * 查询符合条件的员工培训档案列表
     *
     * @param bo 查询条件
     * @return 员工培训档案列表
     */
    @Override
    public List<EmployeeTrainingVo> queryList(EmployeeTrainingBo bo) {
        LambdaQueryWrapper<EmployeeTraining> lqw = buildQueryWrapper(bo);
        return baseMapper.selectVoList(lqw);
    }

    private LambdaQueryWrapper<EmployeeTraining> buildQueryWrapper(EmployeeTrainingBo bo) {
        Map<String, Object> params = bo.getParams();
        LambdaQueryWrapper<EmployeeTraining> lqw = Wrappers.lambdaQuery();
        lqw.eq(bo.getEmployeeId() != null, EmployeeTraining::getEmployeeId, bo.getEmployeeId());
        lqw.like(StringUtils.isNotBlank(bo.getName()), EmployeeTraining::getName, bo.getName());
        lqw.eq(StringUtils.isNotBlank(bo.getTrainingCourse()), EmployeeTraining::getTrainingCourse, bo.getTrainingCourse());
        lqw.eq(StringUtils.isNotBlank(bo.getTrainingInstitution()), EmployeeTraining::getTrainingInstitution, bo.getTrainingInstitution());
        lqw.eq(StringUtils.isNotBlank(bo.getTrainer()), EmployeeTraining::getTrainer, bo.getTrainer());
        lqw.between(params.get("beginTrainingTime") != null && params.get("endTrainingTime") != null,
                EmployeeTraining::getTrainingTime, params.get("beginTrainingTime"), params.get("endTrainingTime"));
        lqw.between(params.get("beginServiceEndDate") != null && params.get("endServiceEndDate") != null,
                EmployeeTraining::getServiceEndDate, params.get("beginServiceEndDate"), params.get("endServiceEndDate"));
        lqw.eq(StringUtils.isNotBlank(bo.getServiceYears()), EmployeeTraining::getServiceYears, bo.getServiceYears());
        lqw.eq(bo.getTrainingAmount() != null, EmployeeTraining::getTrainingAmount, bo.getTrainingAmount());
        lqw.orderByDesc(EmployeeTraining::getId);
        return lqw;
    }

    /**
     * 新增员工培训档案
     *
     * @param bo 员工培训档案
     * @return 是否新增成功
     */
    @Override
    public Boolean insertByBo(EmployeeTrainingBo bo) {
        EmployeeTraining add = MapstructUtils.convert(bo, EmployeeTraining.class);
        validEntityBeforeSave(add);
        boolean flag = baseMapper.insert(add) > 0;
        if (flag) {
            bo.setId(add.getId());
        }
        return flag;
    }

    /**
     * 修改员工培训档案
     *
     * @param bo 员工培训档案
     * @return 是否修改成功
     */
    @Override
    public Boolean updateByBo(EmployeeTrainingBo bo) {
        EmployeeTraining update = MapstructUtils.convert(bo, EmployeeTraining.class);
        validEntityBeforeSave(update);
        return baseMapper.updateById(update) > 0;
    }

    /**
     * 保存前的数据校验
     */
    private void validEntityBeforeSave(EmployeeTraining entity) {
        // 做一些数据校验,如唯一约束
    }

    /**
     * 校验并批量删除员工培训档案信息
     *
     * @param ids     待删除的主键集合
     * @param isValid 是否进行有效性校验
     * @return 是否删除成功
     */
    @Override
    public Boolean deleteWithValidByIds(Collection<Long> ids, Boolean isValid) {
        if (isValid) {
            // 做一些业务上的校验,判断是否需要校验
        }
        return baseMapper.deleteByIds(ids) > 0;
    }

}
