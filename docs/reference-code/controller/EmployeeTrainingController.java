package com.reference.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.reference.domain.bo.EmployeeTrainingBo;
import com.reference.domain.vo.EmployeeTrainingVo;
import com.reference.service.IEmployeeTrainingService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.dromara.common.core.domain.R;
import org.dromara.common.core.validate.AddGroup;
import org.dromara.common.core.validate.EditGroup;
import org.dromara.common.excel.utils.ExcelUtil;
import org.dromara.common.idempotent.annotation.RepeatSubmit;
import org.dromara.common.log.annotation.Log;
import org.dromara.common.log.enums.BusinessType;
import org.dromara.common.mybatis.core.page.PageQuery;
import org.dromara.common.mybatis.core.page.TableDataInfo;
import org.dromara.common.web.core.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 员工培训档案
 *
 * @author LiuBin
 * @date 2025-12-07
 */
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/employee/training")
public class EmployeeTrainingController extends BaseController {

    private final IEmployeeTrainingService employeeTrainingService;

    /**
     * 查询员工培训档案列表
     */
    @SaCheckPermission("employee:training:list")
    @GetMapping("/list")
    public TableDataInfo<EmployeeTrainingVo> list(EmployeeTrainingBo bo, PageQuery pageQuery) {
        return employeeTrainingService.queryPageList(bo, pageQuery);
    }

    /**
     * 导出员工培训档案列表
     */
    @SaCheckPermission("employee:training:export")
    @Log(title = "员工培训档案", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(EmployeeTrainingBo bo, HttpServletResponse response) {
        List<EmployeeTrainingVo> list = employeeTrainingService.queryList(bo);
        ExcelUtil.exportExcel(list, "员工培训档案", EmployeeTrainingVo.class, response);
    }

    /**
     * 获取员工培训档案详细信息
     *
     * @param id 主键
     */
    @SaCheckPermission("employee:training:query")
    @GetMapping("/{id}")
    public R<EmployeeTrainingVo> getInfo(@NotNull(message = "主键不能为空")
                                         @PathVariable Long id) {
        return R.ok(employeeTrainingService.queryById(id));
    }

    /**
     * 新增员工培训档案
     */
    @SaCheckPermission("employee:training:add")
    @Log(title = "员工培训档案", businessType = BusinessType.INSERT)
    @RepeatSubmit()
    @PostMapping()
    public R<Void> add(@Validated(AddGroup.class) @RequestBody EmployeeTrainingBo bo) {
        return toAjax(employeeTrainingService.insertByBo(bo));
    }

    /**
     * 修改员工培训档案
     */
    @SaCheckPermission("employee:training:edit")
    @Log(title = "员工培训档案", businessType = BusinessType.UPDATE)
    @RepeatSubmit()
    @PutMapping()
    public R<Void> edit(@Validated(EditGroup.class) @RequestBody EmployeeTrainingBo bo) {
        return toAjax(employeeTrainingService.updateByBo(bo));
    }

    /**
     * 删除员工培训档案
     *
     * @param ids 主键串
     */
    @SaCheckPermission("employee:training:remove")
    @Log(title = "员工培训档案", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public R<Void> remove(@NotEmpty(message = "主键不能为空")
                          @PathVariable Long[] ids) {
        return toAjax(employeeTrainingService.deleteWithValidByIds(List.of(ids), true));
    }

}
