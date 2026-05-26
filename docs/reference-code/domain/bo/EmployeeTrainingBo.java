package com.reference.domain.bo;

import com.reference.domain.EmployeeTraining;
import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.core.validate.AddGroup;
import org.dromara.common.core.validate.EditGroup;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 员工培训档案业务对象 employee_training
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Data
@EqualsAndHashCode(callSuper = true)
@AutoMapper(target = EmployeeTraining.class, reverseConvertGenerate = false)
public class EmployeeTrainingBo extends BaseEntity {

    /**
     * 主键
     */
    @NotNull(message = "主键不能为空", groups = {EditGroup.class})
    private Long id;

    /**
     * 员工信息ID
     */
    private Long employeeId;

    /**
     * 姓名
     */
    @NotBlank(message = "姓名不能为空", groups = {AddGroup.class, EditGroup.class})
    private String name;

    /**
     * 身份证号
     */
    @NotBlank(message = "身份证号不能为空", groups = {AddGroup.class, EditGroup.class})
    private String idCardNumber;

    /**
     * 培训课程
     */
    @NotBlank(message = "培训课程不能为空", groups = {AddGroup.class, EditGroup.class})
    private String trainingCourse;

    /**
     * 培训机构
     */
    @NotBlank(message = "培训机构不能为空", groups = {AddGroup.class, EditGroup.class})
    private String trainingInstitution;

    /**
     * 培训讲师
     */
    private String trainer;

    /**
     * 参训时间
     */
    @NotNull(message = "参训时间不能为空", groups = {AddGroup.class, EditGroup.class})
    private LocalDate trainingTime;

    /**
     * 服务期
     */
    @NotNull(message = "服务期不能为空", groups = {AddGroup.class, EditGroup.class})
    private LocalDate serviceEndDate;

    /**
     * 服务年限
     */
    @NotBlank(message = "服务年限不能为空", groups = {AddGroup.class, EditGroup.class})
    private String serviceYears;

    /**
     * 培训金额
     */
    @NotNull(message = "培训金额不能为空", groups = {AddGroup.class, EditGroup.class})
    private BigDecimal trainingAmount;

    /**
     * 备注
     */
    private String remark;

}
