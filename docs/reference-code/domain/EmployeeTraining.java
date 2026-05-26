package com.reference.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.tenant.core.TenantEntity;

import java.io.Serial;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 员工培训档案对象 employee_training
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("employee_training")
public class EmployeeTraining extends TenantEntity {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 员工信息ID
     */
    private Long employeeId;

    /**
     * 姓名
     */
    private String name;

    /**
     * 身份证号
     */
    private String idCardNumber;

    /**
     * 培训课程
     */
    private String trainingCourse;

    /**
     * 培训机构
     */
    private String trainingInstitution;

    /**
     * 培训讲师
     */
    private String trainer;

    /**
     * 参训时间
     */
    private LocalDate trainingTime;

    /**
     * 服务期
     */
    private LocalDate serviceEndDate;

    /**
     * 服务年限
     */
    private String serviceYears;

    /**
     * 培训金额
     */
    private BigDecimal trainingAmount;

    /**
     * 备注
     */
    private String remark;

}
