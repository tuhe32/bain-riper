package com.reference.domain.vo;

import cn.idev.excel.annotation.ExcelIgnoreUnannotated;
import cn.idev.excel.annotation.ExcelProperty;
import com.reference.domain.EmployeeTraining;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 员工培训档案视图对象 employee_training
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Data
@ExcelIgnoreUnannotated
@AutoMapper(target = EmployeeTraining.class)
public class EmployeeTrainingVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @ExcelProperty(value = "主键")
    private Long id;

    /**
     * 员工信息ID
     */
    @ExcelProperty(value = "员工信息ID")
    private Long employeeId;

    /**
     * 姓名
     */
    @ExcelProperty(value = "姓名")
    private String name;

    /**
     * 身份证号
     */
    @ExcelProperty(value = "身份证号")
    private String idCardNumber;

    /**
     * 培训课程
     */
    @ExcelProperty(value = "培训课程")
    private String trainingCourse;

    /**
     * 培训机构
     */
    @ExcelProperty(value = "培训机构")
    private String trainingInstitution;

    /**
     * 培训讲师
     */
    @ExcelProperty(value = "培训讲师")
    private String trainer;

    /**
     * 参训时间
     */
    @ExcelProperty(value = "参训时间")
    private LocalDate trainingTime;

    /**
     * 服务期
     */
    @ExcelProperty(value = "服务期")
    private LocalDate serviceEndDate;

    /**
     * 服务年限
     */
    @ExcelProperty(value = "服务年限")
    private String serviceYears;

    /**
     * 培训金额
     */
    @ExcelProperty(value = "培训金额")
    private BigDecimal trainingAmount;

    /**
     * 备注
     */
    @ExcelProperty(value = "备注")
    private String remark;

}
